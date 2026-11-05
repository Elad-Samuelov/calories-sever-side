/* Chimney Explorer — default content. Everything here can be edited in Owner mode;
   edits are stored on the device and override these defaults. */
(function () {
  'use strict';

  const TYPES = [
    {
      id: 'masonry',
      name: 'Masonry Chimney',
      desc: 'A traditional brick chimney and fireplace, from the cap on the roof down to the hearth.',
      parts: [
        { id: 'cap', x: 300, y: 64, side: 'r' },
        { id: 'crown', x: 386, y: 124, side: 'r' },
        { id: 'flashing', x: 232, y: 318, side: 'l' },
        { id: 'liner', x: 300, y: 250, side: 'r' },
        { id: 'brick', x: 366, y: 470, side: 'r' },
        { id: 'smoke', x: 300, y: 630, side: 'r' },
        { id: 'damper', x: 300, y: 684, side: 'l' },
        { id: 'firebox', x: 300, y: 790, side: 'r' },
        { id: 'hearth', x: 450, y: 936, side: 'l' }
      ]
    },
    {
      id: 'wood',
      name: 'Wood-Burning Fireplace',
      desc: 'An open fireplace in side section. See how the fire draws air and where the smoke goes.',
      parts: [
        { id: 'liner', x: 310, y: 150, side: 'r' },
        { id: 'smoke', x: 312, y: 345, side: 'r' },
        { id: 'shelf', x: 268, y: 490, side: 'l' },
        { id: 'damper', x: 336, y: 462, side: 'r' },
        { id: 'firebrick', x: 214, y: 640, side: 'l' },
        { id: 'firebox', x: 330, y: 560, side: 'r' },
        { id: 'mantel', x: 452, y: 405, side: 'l' },
        { id: 'hearth', x: 500, y: 694, side: 'l' },
        { id: 'ashdump', x: 272, y: 780, side: 'r' }
      ]
    },
    {
      id: 'insert',
      name: 'Fireplace Insert',
      desc: 'A sealed, high-efficiency stove fitted into an existing masonry fireplace.',
      parts: [
        { id: 'flexliner', x: 300, y: 110, side: 'r' },
        { id: 'blockoff', x: 380, y: 299, side: 'r' },
        { id: 'insert', x: 300, y: 432, side: 'r' },
        { id: 'glass', x: 300, y: 512, side: 'r' },
        { id: 'gasket', x: 229, y: 592, side: 'l' },
        { id: 'blower', x: 300, y: 651, side: 'r' },
        { id: 'surround', x: 179, y: 470, side: 'l' }
      ]
    }
  ];

  const PARTS = {
    cap: {
      name: 'Chimney Cap',
      tagline: 'The roof over your chimney.',
      what: 'The cap is the metal cover that sits on top of the flue. It keeps rain, snow, leaves and animals out of the chimney, and its mesh screen stops hot embers from landing on your roof.\n\nA good cap also helps block wind from blowing down the chimney, so smoke goes up instead of back into the room.',
      problems: ['Missing or blown off in a storm', 'Rusted or corroded metal', 'Mesh screen clogged with soot, which chokes the draft', 'Birds, squirrels or raccoons nesting inside', 'Wrong size for the flue'],
      service: 'We measure your flue and install a properly sized stainless steel or copper cap that is built to last. We also clean clogged screens, replace rusted caps, and fit custom caps for chimneys with more than one flue.'
    },
    crown: {
      name: 'Chimney Crown',
      tagline: 'The concrete lid that seals the top of the brick.',
      what: 'The crown is the sloped concrete slab that covers the top of the chimney around the flue. Its job is to shed water away from the brickwork.\n\nWater that gets past a damaged crown soaks down into the masonry, where freezing and thawing slowly breaks it apart from the inside.',
      problems: ['Cracks from years of freeze and thaw', 'Built from thin mortar instead of proper concrete', 'No overhang, so water runs straight down the brick', 'Pieces breaking off and falling'],
      service: 'Small cracks are sealed with a flexible, waterproof crown coating. When the crown is too far gone, we rebuild it with reinforced concrete, a proper overhang and drip edge, and an expansion gap around the flue.'
    },
    flashing: {
      name: 'Flashing',
      tagline: 'The watertight seal where chimney meets roof.',
      what: 'Flashing is the bent metal that covers the joint between your roof and the chimney. Step flashing is woven into the shingles, and counter-flashing is cut into the mortar joints and laps over it.\n\nWhen it works, you never think about it. When it fails, it is one of the most common causes of roof leaks.',
      problems: ['Water stains on the ceiling or walls near the chimney', 'Metal lifted, bent or rusted through', 'Old tar or caulk patches that have dried and cracked', 'Counter-flashing pulled out of the mortar joints'],
      service: 'We remove the failed flashing and install new step and counter-flashing, cut and sealed into the mortar joints. On wide chimneys we add a cricket, a small peaked roof that steers water around the chimney.'
    },
    liner: {
      name: 'Flue Liner',
      tagline: 'The protective channel that carries smoke out.',
      what: 'The flue liner is the clay tile or metal pipe running up the inside of the chimney. It carries smoke and hot gases safely out of the house, and keeps heat and acidic byproducts away from the brick and the wood framing around it.\n\nThe liner also has to be the right size for your fireplace or stove so the chimney draws properly.',
      problems: ['Cracked or broken tiles, often after a chimney fire', 'Gaps in the mortar joints between tiles', 'Heavy creosote buildup, which is a fire risk', 'Wrong size for the appliance, causing smoke and poor draft'],
      service: 'We inspect the full length of the flue with a camera and show you what we find. Depending on the damage we repair the tile joints, or reline the chimney with a stainless steel liner sized to your fireplace or stove.'
    },
    brick: {
      name: 'Brick & Mortar',
      tagline: 'The structure that holds everything together.',
      what: 'The bricks give the chimney its strength, and the mortar joints between them hold it together and keep water out. Mortar is designed to wear out before the brick does, so it needs attention every few decades.',
      problems: ['Spalling: brick faces flaking or popping off', 'Mortar joints that are crumbling or recessed', 'White chalky stains (efflorescence), a sign water is getting in', 'Cracks, leaning, or loose bricks near the top'],
      service: 'We repoint worn joints (tuckpointing) with matching mortar, replace damaged bricks with color-matched ones, and rebuild the top of the chimney when needed. We finish with a breathable water repellent that keeps rain out without trapping moisture.'
    },
    smoke: {
      name: 'Smoke Chamber',
      tagline: 'The funnel between the fireplace and the flue.',
      what: 'The smoke chamber is the funnel-shaped space above the damper. It gathers smoke from the wide fireplace and squeezes it into the narrow flue.\n\nIts walls should be smooth so smoke flows straight up. Rough, stepped brick creates turbulence, slows the draft and collects creosote.',
      problems: ['Rough, stepped brick that traps creosote', 'Cracks or gaps that let heat reach nearby wood framing', 'Smoke coming back into the room', 'Flagged in a home inspection'],
      service: 'We parge the smoke chamber: a heat-resistant refractory mortar applied in a smooth, sealed coat. This improves draft, makes the chamber easier to clean, and closes gaps that are a fire hazard.'
    },
    damper: {
      name: 'Damper',
      tagline: 'The door that opens for fires and closes after.',
      what: 'The damper is a metal plate that you open when you light a fire and close when the fireplace is not in use. Closed, it keeps your heated or cooled air in the house and keeps cold drafts, rain and animals out.',
      problems: ['Rusted shut or stuck open', 'Warped plate that no longer seals', 'Broken handle or chain', 'Cold drafts and higher energy bills'],
      service: 'We repair or replace throat dampers. Often the best fix is a top-sealing damper: it mounts at the top of the chimney, seals tightly with a rubber gasket, and doubles as a rain cap.'
    },
    firebox: {
      name: 'Firebox',
      tagline: 'Where the fire actually burns.',
      what: 'The firebox is the chamber where you build the fire. It is lined with firebrick and heat-resistant refractory mortar, which can handle temperatures that would crack normal brick.\n\nIts shape also matters: the angled walls reflect heat into the room.',
      problems: ['Cracked or loose firebricks', 'Mortar joints eroded more than a quarter inch deep', 'Gaps that let heat reach the masonry and framing behind', 'Cracked refractory panels in factory-built fireplaces'],
      service: 'We replace damaged firebricks, repoint joints with refractory mortar, and rebuild the firebox when needed. For factory-built fireplaces we install new refractory panels.'
    },
    hearth: {
      name: 'Hearth',
      tagline: 'The fireproof floor in front of the fire.',
      what: 'The hearth is the non-combustible floor inside the fireplace and the slab that extends out into the room. It protects your floor from sparks, rolling logs and hot ash.\n\nBuilding codes set how far it must extend in front of and beside the opening.',
      problems: ['Cracked slab or loose tiles', 'Too small to meet code for the size of the opening', 'Gaps where embers could reach the wood subfloor', 'Scorch marks on the floor nearby'],
      service: 'We repair or replace hearth slabs and tiles, extend undersized hearths to code, and seal gaps so embers can never reach the floor structure.'
    },
    firebrick: {
      name: 'Firebrick Lining',
      tagline: 'The heat-proof walls of the firebox.',
      what: 'Firebrick is a dense, heat-resistant brick laid with refractory mortar. It lines the back, sides and floor of the firebox and takes the direct heat of the fire so the structure behind it stays safe.\n\nThe sloped back wall reflects heat forward and guides smoke toward the throat.',
      problems: ['Cracked or spalling firebricks', 'Missing or crumbling mortar between bricks', 'Bricks pushed loose by heat and expansion', 'Heat damage reaching the masonry behind'],
      service: 'We replace damaged firebrick and repoint with refractory mortar. When the lining is worn out we rebuild the back and side walls with new firebrick to the correct angles.'
    },
    shelf: {
      name: 'Smoke Shelf',
      tagline: 'The ledge that stops downdrafts.',
      what: 'The smoke shelf is the flat ledge right behind the damper, at the bottom of the smoke chamber. Cold air coming down the chimney hits the shelf and turns back up, instead of pushing smoke into the room.\n\nIt also catches debris, so it needs regular cleaning.',
      problems: ['Piled with soot, debris or nesting material', 'Rust and water damage from a leaking chimney', 'Cracked or crumbling masonry'],
      service: 'We clean the smoke shelf on every sweep, check it for water damage, and repair or seal the masonry where needed.'
    },
    mantel: {
      name: 'Mantel & Surround',
      tagline: 'The finished face around the fireplace.',
      what: 'The surround is the stone, tile or brick facing around the fireplace opening. The mantel is the decorative shelf above it.\n\nBecause a mantel is usually wood, it must sit a safe distance from the opening. Codes set those distances by how far the mantel sticks out.',
      problems: ['Wood mantel or trim too close to the opening', 'Scorching or discoloring above the opening', 'Cracked tiles or loose stone facing', 'Gaps between the facing and the firebox'],
      service: 'We check clearances and correct them, reset loose stone, replace cracked tile, and seal gaps between the surround and the firebox.'
    },
    ashdump: {
      name: 'Ash Dump & Ash Pit',
      tagline: 'A trapdoor that makes cleanup easy.',
      what: 'Many masonry fireplaces have a small metal door in the firebox floor. Cold ashes are swept through it into an ash pit below, then removed through a cleanout door outside or in the basement.',
      problems: ['Missing or stuck lid that lets drafts and embers through', 'Ash pit filled to the top', 'Rusted or missing cleanout door', 'Water collecting in the pit'],
      service: 'We replace ash dump and cleanout doors, empty and inspect the ash pit, and fix the source of any water getting in.'
    },
    insert: {
      name: 'Insert Unit',
      tagline: 'A high-efficiency stove inside your fireplace.',
      what: 'An insert is a closed firebox, usually steel or cast iron, that slides into an existing masonry fireplace. Because it is sealed, it burns far more efficiently and sends much more heat into the room than an open fireplace.\n\nInserts can burn wood, gas or pellets.',
      problems: ['Low heat output or hard to keep burning', 'Warped or cracked baffle or interior parts', 'Smoke smell or soot in the room', 'Overfiring that damages the unit'],
      service: 'We clean and service inserts every year and replace worn parts like baffles and bricks. We also size and install new inserts, including the full chimney liner they need.'
    },
    surround: {
      name: 'Surround Panel',
      tagline: 'The trim that fits the insert to your fireplace.',
      what: 'The surround is the metal panel around the insert. It covers the gap between the insert and the old fireplace opening, gives a finished look, and stops room air from leaking around the unit.',
      problems: ['Gaps around the edges', 'Loose or bent panel', 'Missing insulation behind the panel', 'Wrong size for the opening'],
      service: 'We fit and secure the surround, insulate behind it, and seal it so warm air stays in the room.'
    },
    glass: {
      name: 'Glass Door',
      tagline: 'Watch the fire, keep it contained.',
      what: 'The door glass is special ceramic glass that can handle very high temperatures. It lets you see the fire while keeping the firebox sealed.\n\nMany inserts use an air-wash system that sweeps clean air across the glass to keep it clear.',
      problems: ['Black or white haze that will not wipe off', 'Cracked or chipped glass (do not use the insert)', 'Loose clips or frame', 'Glass that gets dirty quickly, a sign of a poor burn'],
      service: 'We professionally clean stubborn deposits and replace cracked glass with the correct rated ceramic glass for your model. We also look for the cause of fast-dirtying glass, such as wet wood or a draft problem.'
    },
    gasket: {
      name: 'Door Gasket',
      tagline: 'The rope seal that keeps the fire in control.',
      what: 'The gasket is a woven fiberglass rope around the door and glass. It makes the firebox airtight, so the air controls set how hot and how long the fire burns.',
      problems: ['Flattened, frayed or hardened rope', 'Smoke leaking from the door edge', 'Fire burns too hot and cannot be turned down', 'Door closes too loosely'],
      service: 'We replace gaskets with the correct diameter and density for your unit and adjust the latch so the door seals tight.'
    },
    blower: {
      name: 'Blower',
      tagline: 'The fan that pushes warm air into the room.',
      what: 'The blower is a quiet fan beneath or behind the firebox. It pulls room air through channels around the hot firebox and sends it back out warm, so heat spreads across the room instead of staying near the fireplace.',
      problems: ['Loud humming, rattling or squealing', 'Does not turn on, or turns off too early', 'Clogged with dust and ash', 'Failed temperature sensor'],
      service: 'We clean the blower and its air channels and replace worn motors, bearings or sensors with the correct parts for your model.'
    },
    flexliner: {
      name: 'Stainless Steel Liner',
      tagline: 'A dedicated chimney for your insert.',
      what: 'An insert needs a full-length stainless steel liner, connected directly from the insert to the top of the chimney. The old clay flue is usually too large for an insert, which leads to poor draft and heavy creosote.\n\nThe liner is sized to the insert\'s outlet and often insulated.',
      problems: ['No liner, with the insert vented into the old flue', 'Wrong diameter for the insert', 'Loose or gapped connection at the insert', 'Creosote buildup inside the liner'],
      service: 'We install full-length, insulated stainless steel liners with a sealed top plate and cap, and we sweep and inspect existing liners every year.'
    },
    blockoff: {
      name: 'Block-Off Plate',
      tagline: 'Keeps the heat in the room, not up the chimney.',
      what: 'The block-off plate is a sheet-metal plate that seals the old damper area around the liner. It keeps heat from the insert in the room, stops cold air from coming down, and is required by many insert manufacturers.',
      problems: ['Missing plate, so heat escapes up the old chimney', 'Gaps around the liner', 'Rusted or loose plate'],
      service: 'We fabricate a custom plate for your fireplace and seal it around the liner with high-temperature sealant.'
    }
  };

  const SETTINGS = {
    business: 'Chimney Explorer',
    phone: '',
    homeTitle: 'What type of fireplace do you have?',
    homeSub: 'Choose one to explore how it works, part by part.'
  };

  window.CX_CONTENT = { TYPES, PARTS, SETTINGS };
})();
