import * as THREE from 'three'

/**
 * Creates the HD Heart Whistle matching user reference photo 4:
 * - A plump, volumetric ruby-red translucent glass gem heart
 * - Integrated sports whistle mouthpiece (boquilla con bisel de escape de aire)
 * - Chrome ring/loop on top
 * - Physical education lanyard (cordón trenzado) hanging gracefully
 * - Utilizes MeshPhysicalMaterial with transmission and optical refraction
 */
export function createHeartWhistle(options: { lowQuality?: boolean } = {}): THREE.Group {
  const group = new THREE.Group()
  group.name = 'heart-whistle'
  const lowQuality = options.lowQuality ?? false

  // ─── MATERIALS ───
  // Ruby Red Glass Material (Gem-like refraction, smooth specular shine)
  const rubyGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xf42255,
    emissive: 0x330011,
    emissiveIntensity: 0.15,
    roughness: 0.06,
    metalness: 0.04,
    transmission: 0.88,
    ior: 1.54,
    thickness: 0.6,
    specularIntensity: 1.0,
    specularColor: 0xffffff,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: true,
  })

  // Mobile GPUs cannot afford the full-scene transmission pass; fake the
  // glassy look with opacity + clearcoat instead (visually near-identical)
  if (lowQuality) {
    rubyGlassMat.transmission = 0
    rubyGlassMat.opacity = 0.88
    rubyGlassMat.roughness = 0.1
  }

  // Polished silver chrome for mouthpiece tip and hanging ring
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.95,
    roughness: 0.12,
  })

  // Sports lanyard cord material (pink/neon magenta woven ribbon)
  const lanyardMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.7,
    metalness: 0.1,
  })

  // ─── 1. VOLUMETRIC HEART BODY ───
  // Smooth Bézier 2D heart shape
  const heartShape = new THREE.Shape()
  // Bottom tip of heart
  heartShape.moveTo(0, -0.45)
  // Left curve to bottom
  heartShape.bezierCurveTo(-0.15, -0.3, -0.5, -0.05, -0.5, 0.22)
  // Left top lobe
  heartShape.bezierCurveTo(-0.5, 0.48, -0.22, 0.52, 0, 0.28)
  // Right top lobe
  heartShape.bezierCurveTo(0.22, 0.52, 0.5, 0.48, 0.5, 0.22)
  // Right curve to bottom
  heartShape.bezierCurveTo(0.5, -0.05, 0.15, -0.3, 0, -0.45)

  // Extrude with rich bevel to create the plump, cushiony gem look from photo 4
  const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.22,
    bevelEnabled: true,
    bevelSegments: 10,
    bevelSize: 0.14,
    bevelThickness: 0.14,
  })
  heartGeo.center()

  const heartMesh = new THREE.Mesh(heartGeo, rubyGlassMat)
  heartMesh.castShadow = true
  heartMesh.receiveShadow = true
  group.add(heartMesh)

  // Inner sparkling core (amplifies the gem light refraction effect)
  const innerHeartGeo = heartGeo.clone()
  innerHeartGeo.scale(0.85, 0.85, 0.7)
  const innerHeartMat = new THREE.MeshBasicMaterial({
    color: 0xff3366,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
  })
  const innerMesh = new THREE.Mesh(innerHeartGeo, innerHeartMat)
  group.add(innerMesh)

  // ─── 2. WHISTLE MOUTHPIECE (BOQUILLA) ───
  // Mouthpiece body extending from top right side of heart
  const mouthpieceGroup = new THREE.Group()
  mouthpieceGroup.position.set(0.24, 0.38, 0)
  mouthpieceGroup.rotation.z = -Math.PI * 0.22

  // Tapered nozzle cylinder
  const nozzleGeo = new THREE.CylinderGeometry(0.08, 0.11, 0.32, 24)
  const nozzleMesh = new THREE.Mesh(nozzleGeo, rubyGlassMat)
  nozzleMesh.castShadow = true
  mouthpieceGroup.add(nozzleMesh)

  // Mouthpiece chrome lip / tip (where air is blown in)
  const tipGeo = new THREE.CylinderGeometry(0.075, 0.082, 0.08, 24)
  const tipMesh = new THREE.Mesh(tipGeo, chromeMat)
  tipMesh.position.y = 0.18
  mouthpieceGroup.add(tipMesh)

  // Whistle air escape slit (fipple sound window)
  const fippleGeo = new THREE.BoxGeometry(0.12, 0.06, 0.08)
  const fippleMat = new THREE.MeshBasicMaterial({ color: 0x1a0008 })
  const fippleMesh = new THREE.Mesh(fippleGeo, fippleMat)
  fippleMesh.position.set(0, 0.02, 0.06)
  mouthpieceGroup.add(fippleMesh)

  group.add(mouthpieceGroup)

  // ─── 3. TOP HANGING LOOP & CHROME RING ───
  const ringGeo = new THREE.TorusGeometry(0.08, 0.02, 16, 24)
  const ringMesh = new THREE.Mesh(ringGeo, chromeMat)
  ringMesh.position.set(-0.16, 0.42, 0)
  ringMesh.rotation.y = Math.PI * 0.3
  ringMesh.castShadow = true
  group.add(ringMesh)

  // ─── 4. PHYSICAL EDUCATION LANYARD CORD ───
  // Smooth curved tube draping from the ring
  const cordCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.16, 0.42, 0),
    new THREE.Vector3(-0.24, 0.58, -0.05),
    new THREE.Vector3(-0.28, 0.72, 0.02),
    new THREE.Vector3(-0.25, 0.85, 0.08),
    new THREE.Vector3(-0.18, 0.95, 0.0),
  ])
  const cordGeo = new THREE.TubeGeometry(cordCurve, 24, 0.022, 8, false)
  const cordMesh = new THREE.Mesh(cordGeo, lanyardMat)
  cordMesh.castShadow = true
  group.add(cordMesh)

  // Scale and tilt slightly for charming display
  group.scale.set(0.9, 0.9, 0.9)
  group.rotation.z = Math.PI * 0.04

  return group
}
