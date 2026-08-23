import sys

path = r"C:\Users\ndour\Desktop\Projet soutenance\kolisgo-api\src\main\java\sn\isi\kolisgo_api\service\ChauffeurService.java"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

old_block = re.search(r'String heureDepart = java\.time\.LocalTime\.now\(\)\.toString\(\)\.substring\(0, 5\);.*?statut\("PENDING"\)\s*\.build\(\);\s*\}', content, re.DOTALL)

if old_block:
    new_block = """java.time.LocalTime now = java.time.LocalTime.now();
        String heureDepart = now.toString().substring(0, 5);
        String heureArriveeHub = now.minusMinutes(15).toString().substring(0, 5);

        // 1. Construire les informations du trajet
        FeuilleRouteResponse.TrajetJour trajetJour = FeuilleRouteResponse.TrajetJour.builder()
                .depart("Hub de d\\u00E9part")
                .arrivee(arriveeStr)
                .heure(heureDepart)
                .build();

        // 2. Construire les KPIs
        FeuilleRouteResponse.Kpis kpis = FeuilleRouteResponse.Kpis.builder()
                .hubs(hubs)
                .colis(totalColis)
                .duree((hubs * 2) + "h") // Estimation basique : 2h par hub
                .build();

        // 3. Construire les \\u00E9tapes
        List<FeuilleRouteResponse.Etape> etapes = new ArrayList<>();

        // \\u00C9tape de d\\u00E9part
        etapes.add(FeuilleRouteResponse.Etape.builder()
                .num(1)
                .nom("Hub de d\\u00E9part")
                .action("Chargement des colis")
                .heure(heureArriveeHub)
                .detail(totalColis + " colis \\u00E0 charger")
                .statut(enTransit ? "DONE" : "ACTIVE")
                .build());

        // \\u00C9tapes de d\\u00E9chargement par hub
        int index = 2;
        int minutesOffset = 45;
        for (Map.Entry<String, Integer> entry : destinationsMap.entrySet()) {
            String heureEtape = now.plusMinutes(minutesOffset).toString().substring(0, 5);
            etapes.add(FeuilleRouteResponse.Etape.builder()
                    .num(index++)
                    .nom("Hub " + entry.getKey())
                    .action("D\\u00E9chargement")
                    .heure(heureEtape)
                    .detail(entry.getValue() + " colis \\u00E0 d\\u00E9poser")
                    .statut("PENDING")
                    .build());
            minutesOffset += 45;
        }"""
    
    # We need to make sure we don't mess up the encoding. The java file likely uses UTF-8.
    # Note that in python script we should output what we matched.
    content = content.replace(old_block.group(0), new_block)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find block")
