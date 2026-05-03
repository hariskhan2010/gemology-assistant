import { type Conversation, type Message } from "@/lib/types";

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Ruby identification help",
    createdAt: new Date("2026-04-28T10:00:00"),
    updatedAt: new Date("2026-04-28T10:30:00"),
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "I found a red gemstone. It has a hardness of 9 on the Mohs scale and shows strong red fluorescence under UV light. What could it be?",
        timestamp: new Date("2026-04-28T10:00:00"),
      },
      {
        id: "msg-2",
        role: "assistant",
        content: "Based on the properties you've described, this is almost certainly a **ruby**. Here's why:\n\n- **Hardness of 9**: Ruby (corundum) has a Mohs hardness of 9, second only to diamond\n- **Strong red fluorescence**: Rubies fluoresce red under UV due to chromium content\n- **Red color**: Chromium is the trace element responsible for ruby's characteristic red\n\nWould you like me to help you determine its quality or value?",
        timestamp: new Date("2026-04-28T10:01:00"),
      },
      {
        id: "msg-3",
        role: "user",
        content: "Yes, how can I tell if it's natural or synthetic?",
        timestamp: new Date("2026-04-28T10:05:00"),
      },
      {
        id: "msg-4",
        role: "assistant",
        content: "Great question. Here are key indicators to distinguish natural from synthetic rubies:\n\n**Natural Ruby:**\n- May show silk (rutile needle inclusions)\n- Color zoning (uneven color distribution)\n- Natural crystals or mineral inclusions\n- Growth lines visible under magnification\n\n**Synthetic Ruby:**\n- Curved growth lines (Flame fusion method)\n- Bubbles (gas inclusions, rare in natural)\n- Too perfect in clarity\n- May show flux inclusions (flux growth method)\n\nI'd recommend getting it examined by a certified gemologist with proper equipment for a definitive answer.",
        timestamp: new Date("2026-04-28T10:06:00"),
      },
    ],
  },
  {
    id: "conv-2",
    title: "Emerald cut angles",
    createdAt: new Date("2026-04-27T14:00:00"),
    updatedAt: new Date("2026-04-27T14:20:00"),
    messages: [
      {
        id: "msg-5",
        role: "user",
        content: "What are the recommended cutting angles for an emerald?",
        timestamp: new Date("2026-04-27T14:00:00"),
      },
      {
        id: "msg-6",
        role: "assistant",
        content: "Here are the standard cutting angles for an emerald cut (rectangular step cut):\n\n**Crown Angles:**\n- Crown height: 10-15%\n- Table: 60-70%\n- Star facet: 45-50%\n\n**Pavilion Angles:**\n- Pavilion depth: 60-70%\n- Pavilion angle: 40-45 degrees\n\n**Note:** These are general guidelines. Emerald (the gemstone) is typically cut as a cabochon or in a step cut to preserve color and minimize waste due to its typical inclusion content.",
        timestamp: new Date("2026-04-27T14:01:00"),
      },
    ],
  },
  {
    id: "conv-3",
    title: "Mohs hardness scale",
    createdAt: new Date("2026-04-26T09:00:00"),
    updatedAt: new Date("2026-04-26T09:10:00"),
    messages: [
      {
        id: "msg-7",
        role: "user",
        content: "Can you explain the Mohs hardness scale for gemstones?",
        timestamp: new Date("2026-04-26T09:00:00"),
      },
      {
        id: "msg-8",
        role: "assistant",
        content: "The Mohs hardness scale measures a mineral's resistance to scratching, ranging from 1 (softest) to 10 (hardest):\n\n1. **Talc** - Fingernail scratches easily\n2. **Gypsum** - Fingernail can scratch\n3. **Calcite** - Copper coin scratches\n4. **Fluorite** - Knife blade scratches\n5. **Apatite** - Knife blade scratches with difficulty\n6. **Orthoclase** - Steel file scratches\n7. **Quartz** - Scratches glass\n8. **Topaz** - Very hard, scratches quartz\n9. **Corundum** (Ruby/Sapphire) - Second only to diamond\n10. **Diamond** - Hardest natural substance\n\nRemember: the scale is ordinal, not linear. Diamond (10) is about 4x harder than corundum (9).",
        timestamp: new Date("2026-04-26T09:01:00"),
      },
    ],
  },
];
