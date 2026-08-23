package sn.isi.kolisgo_api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.isi.kolisgo_api.model.Chauffeur;
import sn.isi.kolisgo_api.model.Expedition;
import sn.isi.kolisgo_api.model.GestionnaireHub;
import sn.isi.kolisgo_api.model.enums.ModeLivraison;
import sn.isi.kolisgo_api.model.enums.StatutExpedition;
import sn.isi.kolisgo_api.repository.ChauffeurRepository;
import sn.isi.kolisgo_api.repository.ExpeditionRepository;
import sn.isi.kolisgo_api.web.dto.ExpeditionResponse;
import sn.isi.kolisgo_api.web.dto.ExpeditionListItemResponse;
import sn.isi.kolisgo_api.web.dto.FeuilleRouteResponse;
import sn.isi.kolisgo_api.web.dto.TourneeHistoriqueResponse;
import sn.isi.kolisgo_api.web.mapper.ExpeditionMapper;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.EntityNotFoundException;

import sn.isi.kolisgo_api.repository.HubRepository;

@Service
@RequiredArgsConstructor
public class ChauffeurService {
    private static final String CHAUFFEUR_INTROUVABLE = "Chauffeur introuvable";

    private final ChauffeurRepository chauffeurRepository;
    private final ExpeditionRepository expeditionRepository;
    private final ExpeditionUtils      expeditionUtils;
    private final ExpeditionMapper expeditionMapper;
    private final EmailService emailService;
    private final HubRepository hubRepository;

    // Chauffeur part en inter-hub
    @Transactional
    public ExpeditionResponse departInterHub(Long expeditionId, Long chauffeurId, String lieuDepart) {

        Expedition expedition = expeditionRepository.findById(expeditionId)
                .orElseThrow(() -> new EntityNotFoundException("Expédition introuvable"));

        if (expedition.getStatut() != StatutExpedition.RECU_AU_HUB) {
            throw new IllegalStateException("Le colis doit être au hub avant le transit " +
                    "(statut actuel : " + expedition.getStatut() + ")");
        }

        if (expedition.getChauffeurAssigne() == null
                || !expedition.getChauffeurAssigne().getId().equals(chauffeurId)) {
            throw new IllegalStateException("Ce colis n'est pas affecté à ce chauffeur");
        }

        expedition.setStatut(StatutExpedition.EN_TRANSIT);

        expeditionUtils.ajouterEtape(
                expedition,
                StatutExpedition.EN_TRANSIT,
                lieuDepart,
                "Colis chargé — départ inter-hub depuis : " + lieuDepart
        );

        expeditionRepository.save(expedition);
        return expeditionMapper.toResponse(expedition);
    }

    // AJOUT : liste des expéditions affectées à ce chauffeur, prêtes pour le départ
    @Transactional(readOnly = true)
    public List<ExpeditionListItemResponse> getMesExpeditionsAFaireParti(Long chauffeurId) {
        Chauffeur chauffeur = chauffeurRepository.findById(chauffeurId)
                .orElseThrow(() -> new EntityNotFoundException(CHAUFFEUR_INTROUVABLE));

        return expeditionRepository
                .findByChauffeurAssigneAndStatut(chauffeur, StatutExpedition.RECU_AU_HUB)
                .stream()
                .map(expeditionMapper::toListItem)
                .toList();
    }

    // AJOUT : liste des expéditions en transit pour ce chauffeur
    @Transactional(readOnly = true)
    public List<ExpeditionListItemResponse> getMesExpeditionsEnTransit(Long chauffeurId) {
        Chauffeur chauffeur = chauffeurRepository.findById(chauffeurId)
                .orElseThrow(() -> new EntityNotFoundException(CHAUFFEUR_INTROUVABLE));

        return expeditionRepository
                .findByChauffeurAssigneAndStatut(chauffeur, StatutExpedition.EN_TRANSIT)
                .stream()
                .map(expeditionMapper::toListItem)
                .toList();
    }

    // AJOUT : chauffeur confirme son arrivée au hub de destination
    @Transactional
    public List<ExpeditionListItemResponse> confirmerArrivee(Long chauffeurId) {

        Chauffeur chauffeur = findChauffeur(chauffeurId);
        List<Expedition> expeditions = expeditionRepository
                .findByChauffeurAssigneAndStatut(chauffeur, StatutExpedition.EN_TRANSIT);

        if (expeditions.isEmpty()) {
            throw new IllegalStateException("Aucune expédition EN_TRANSIT trouvée pour ce chauffeur");
        }

        expeditions.forEach(this::traiterArriveeExpedition);
        expeditionRepository.saveAll(expeditions);

        return expeditions.stream()
                .map(expeditionMapper::toListItem)
                .toList();
    }

    private Chauffeur findChauffeur(Long chauffeurId) {
        return chauffeurRepository.findById(chauffeurId)
                .orElseThrow(() -> new EntityNotFoundException(CHAUFFEUR_INTROUVABLE));
    }

    private void traiterArriveeExpedition(Expedition expedition) {
        expedition.setStatut(StatutExpedition.EN_ATTENTE_RECEPTION);
        expeditionUtils.ajouterEtape(
                expedition,
                StatutExpedition.EN_ATTENTE_RECEPTION,
                determineVilleDestination(expedition),
                "Chauffeur arrivé à destination — en attente de réception par le hub"
        );
        notifierGestionnairesHubDestination(expedition);
    }

    private String determineVilleDestination(Expedition expedition) {
        if (expedition.getModeLivraison() == ModeLivraison.RETRAIT_RELAIS
                && expedition.getPointRelaisDestination() != null
                && expedition.getPointRelaisDestination().getAdresse() != null) {
            return expedition.getPointRelaisDestination().getAdresse().getVille();
        }
        if (expedition.getAdresseDestinataire() != null) {
            return expedition.getAdresseDestinataire().getVille();
        }
        return "";
    }

    private void notifierGestionnairesHubDestination(Expedition expedition) {
        String villeDestination = determineVilleDestination(expedition);
        if (villeDestination.isBlank()) {
            return;
        }

        hubRepository.findByAdresse_Ville(villeDestination).ifPresent(hubDest -> {
            if (hubDest.getGestionnaires() != null) {
                for (GestionnaireHub gh : hubDest.getGestionnaires()) {
                    emailService.envoyerNotificationAssignation(
                            gh.getEmail(),
                            gh.getNomComplet(),
                            "Gestionnaire Hub",
                            expedition.getCodeTracking(),
                            "Réception de colis (Arrivée Chauffeur)"
                    );
                }
            }
        });
    }

    // AJOUT : Générer la feuille de route globale d'un chauffeur
    @Transactional(readOnly = true)
    public FeuilleRouteResponse getFeuilleRoute(Long chauffeurId) {
        Chauffeur chauffeur = findChauffeur(chauffeurId);

        // On cherche d'abord s'il est déjà en route
        boolean enTransit = true;
        List<Expedition> expeditions = expeditionRepository.findByChauffeurAssigneAndStatut(chauffeur, StatutExpedition.EN_TRANSIT);

        // Sinon, on cherche les expéditions en attente de départ
        if (expeditions.isEmpty()) {
            expeditions = expeditionRepository.findByChauffeurAssigneAndStatut(chauffeur, StatutExpedition.RECU_AU_HUB);
            enTransit = false;
        }

        // Si aucune expédition, on retourne une feuille de route vide
        if (expeditions.isEmpty()) {
            return FeuilleRouteResponse.builder()
                    .trajetJour(FeuilleRouteResponse.TrajetJour.builder().depart("--").arrivee("--").heure("--:--").build())
                    .kpis(FeuilleRouteResponse.Kpis.builder().hubs(0).colis(0).duree("0h").build())
                    .etapes(java.util.List.of())
                    .build();
        }

        int totalColis = expeditions.size();

        // Extraire les villes uniques de destination
        Map<String, Integer> destinationsMap = new LinkedHashMap<>();
        for (Expedition exp : expeditions) {
            String ville = determineVilleDestination(exp);
            if (ville == null || ville.isBlank()) {
                ville = "Destination (Hub Suivant)"; // FALLBACK SO IT'S NEVER EMPTY
            }
            destinationsMap.put(ville, destinationsMap.getOrDefault(ville, 0) + 1);
        }

        int hubs = destinationsMap.size();
        String arriveeStr = String.join(" - ", destinationsMap.keySet());
        
        java.time.LocalTime now = java.time.LocalTime.now();
        String heureDepart = now.toString().substring(0, 5); // Heure actuelle formattée
        String heureArriveeHub = now.minusMinutes(15).toString().substring(0, 5); // 15 min avant

        // 1. Construire les informations du trajet
        FeuilleRouteResponse.TrajetJour trajetJour = FeuilleRouteResponse.TrajetJour.builder()
                .depart("Hub de départ")
                .arrivee(arriveeStr)
                .heure(heureDepart)
                .build();

        // 2. Construire les KPIs
        FeuilleRouteResponse.Kpis kpis = FeuilleRouteResponse.Kpis.builder()
                .hubs(hubs)
                .colis(totalColis)
                .duree((hubs * 2) + "h") // Estimation basique : 2h par hub
                .build();

        // 3. Construire les étapes
        List<FeuilleRouteResponse.Etape> etapes = new ArrayList<>();

        // Étape de départ
        etapes.add(FeuilleRouteResponse.Etape.builder()
                .num(1)
                .nom("Hub de départ")
                .action("Chargement des colis")
                .heure(heureArriveeHub)
                .detail(totalColis + " colis à charger")
                .statut(enTransit ? "DONE" : "ACTIVE")
                .build());

        // Étapes de déchargement par hub
        int index = 2;
        int minutesOffset = 45;
        for (Map.Entry<String, Integer> entry : destinationsMap.entrySet()) {
            String heureEtape = now.plusMinutes(minutesOffset).toString().substring(0, 5);
            etapes.add(FeuilleRouteResponse.Etape.builder()
                    .num(index++)
                    .nom("Hub " + entry.getKey())
                    .action("Déchargement")
                    .heure(heureEtape)
                    .detail(entry.getValue() + " colis à déposer")
                    .statut("PENDING")
                    .build());
            minutesOffset += 45;
        }

        return FeuilleRouteResponse.builder()
                .trajetJour(trajetJour)
                .kpis(kpis)
                .etapes(etapes)
                .build();
    }

    @Transactional(readOnly = true)
    public List<TourneeHistoriqueResponse> getHistoriqueTournees(Long chauffeurId) {
        Chauffeur chauffeur = findChauffeur(chauffeurId);


        List<StatutExpedition> statutsHistorique = List.of(
                StatutExpedition.EN_ATTENTE_RECEPTION,
                StatutExpedition.ARRIVE_AU_RELAIS
        );

        List<Expedition> expeditionsTerminees = expeditionRepository
                .findByChauffeurAssigneAndStatutIn(chauffeur, statutsHistorique);

        if (expeditionsTerminees.isEmpty()) {
            return List.of();
        }

        return List.of(
                TourneeHistoriqueResponse.builder()
                        .trajet("Hub de départ → Destination finale")
                        .date("Dernière tournée (" + java.time.LocalDate.now().toString() + ")")
                        .nbLots(expeditionsTerminees.size())
                        .statut("TERMINE")
                        .build()
        );
    }

}