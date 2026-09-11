import * as THREE from 'three'

/**
 * Creates the immersive Locker Room environment:
 * - A 3-bay sports locker with designated pedestals, shelves, and hooks
 * - Tactical whiteboard with coaching plays and "¡Vamos los gorditos! ✨"
 * - Realistic composite field hockey stick leaning against the locker
 * - Large panoramic sports window looking out to:
 *   * Green soccer pitch with white chalk lines & goalposts
 *   * Hockey field with turf, goals, and orange training cones
 *   * Cheerful school/club campus atmosphere with warm sunlight
 */
export function createLockerEnvironment(): {
  group: THREE.Group
  targetPositions: {
    football: THREE.Vector3
    sneaker: THREE.Vector3
    whistle: THREE.Vector3
  }
  spotlights: {
    football: THREE.SpotLight
    sneaker: THREE.SpotLight
    whistle: THREE.SpotLight
  }
} {
  const envGroup = new THREE.Group()
  envGroup.name = 'locker-environment'

  // ─── MATERIALS ───
  // Oak / Birch wood for locker furniture
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0xe2d7c5,
    roughness: 0.6,
    metalness: 0.05,
  })

  // Dark interior backboard of locker (modern athletic club aesthetic)
  const lockerBackMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8,
    metalness: 0.1,
  })

  // Polished chrome / stainless steel for hooks and hardware
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.2,
  })

  // Gold / brass nameplates
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.25,
  })

  // Locker room floor tiles (subtle checkered athletic rubber/tiles)
  const floorCanvas = document.createElement('canvas')
  floorCanvas.width = 512
  floorCanvas.height = 512
  const fCtx = floorCanvas.getContext('2d')!
  fCtx.fillStyle = '#f1f5f9'
  fCtx.fillRect(0, 0, 512, 512)
  fCtx.fillStyle = '#e2e8f0'
  for (let x = 0; x < 512; x += 64) {
    for (let y = 0; y < 512; y += 64) {
      if ((x / 64 + y / 64) % 2 === 0) {
        fCtx.fillRect(x, y, 64, 64)
      }
    }
  }
  const floorTex = new THREE.CanvasTexture(floorCanvas)
  floorTex.wrapS = THREE.RepeatWrapping
  floorTex.wrapT = THREE.RepeatWrapping
  floorTex.repeat.set(8, 8)
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.4,
    metalness: 0.05,
  })

  // ─── 1. ROOM SHELL & FLOOR ───
  const floorGeo = new THREE.PlaneGeometry(24, 20)
  const floorMesh = new THREE.Mesh(floorGeo, floorMat)
  floorMesh.rotation.x = -Math.PI / 2
  floorMesh.position.y = -2.2
  floorMesh.receiveShadow = true
  envGroup.add(floorMesh)

  // Wall behind locker
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.85,
  })
  const backWallGeo = new THREE.PlaneGeometry(24, 12)
  const backWallMesh = new THREE.Mesh(backWallGeo, wallMat)
  backWallMesh.position.set(0, 3, -4)
  backWallMesh.receiveShadow = true
  envGroup.add(backWallMesh)

  // ─── 2. THE 3-BAY LOCKER UNIT ───
  const lockerGroup = new THREE.Group()
  lockerGroup.position.set(0, 0, -1.8)

  const lockerWidth = 4.8
  const lockerHeight = 3.6
  const lockerDepth = 1.1
  const bayWidth = lockerWidth / 3

  // Back panel of locker
  const backGeo = new THREE.BoxGeometry(lockerWidth, lockerHeight, 0.08)
  const backMesh = new THREE.Mesh(backGeo, lockerBackMat)
  backMesh.position.set(0, 0, -lockerDepth / 2 + 0.04)
  backMesh.receiveShadow = true
  lockerGroup.add(backMesh)

  // Outer frame & dividers (4 vertical posts)
  for (let i = 0; i <= 3; i++) {
    const dividerX = -lockerWidth / 2 + i * bayWidth
    const postGeo = new THREE.BoxGeometry(0.1, lockerHeight, lockerDepth)
    const postMesh = new THREE.Mesh(postGeo, woodMat)
    postMesh.position.set(dividerX, 0, 0)
    postMesh.castShadow = true
    postMesh.receiveShadow = true
    lockerGroup.add(postMesh)
  }

  // Top and bottom slabs
  const topSlabGeo = new THREE.BoxGeometry(lockerWidth + 0.1, 0.12, lockerDepth + 0.1)
  const topSlab = new THREE.Mesh(topSlabGeo, woodMat)
  topSlab.position.set(0, lockerHeight / 2, 0)
  topSlab.castShadow = true
  lockerGroup.add(topSlab)

  const bottomSlab = new THREE.Mesh(topSlabGeo, woodMat)
  bottomSlab.position.set(0, -lockerHeight / 2, 0)
  bottomSlab.receiveShadow = true
  lockerGroup.add(bottomSlab)

  // Middle upper shelf across all 3 bays
  const shelfGeo = new THREE.BoxGeometry(lockerWidth, 0.08, lockerDepth - 0.05)
  const upperShelf = new THREE.Mesh(shelfGeo, woodMat)
  upperShelf.position.set(0, lockerHeight / 2 - 0.7, 0)
  upperShelf.receiveShadow = true
  lockerGroup.add(upperShelf)

  // Lower bench across front
  const benchGeo = new THREE.BoxGeometry(lockerWidth + 0.4, 0.14, 0.8)
  const benchMesh = new THREE.Mesh(benchGeo, woodMat)
  benchMesh.position.set(0, -lockerHeight / 2 + 0.25, 0.6)
  benchMesh.castShadow = true
  benchMesh.receiveShadow = true
  lockerGroup.add(benchMesh)

  // Target coordinates for placed objects (in world coordinates)
  const targetPositions = {
    football: new THREE.Vector3(-bayWidth, 0.1, -1.6),
    sneaker: new THREE.Vector3(0, -0.05, -1.6),
    whistle: new THREE.Vector3(bayWidth, 0.2, -1.6),
  }

  // ─── 3. BAY 1 (LEFT): FOOTBALL PEDESTAL ───
  // Ring pedestal to hold the soccer ball
  const ballRingGeo = new THREE.TorusGeometry(0.4, 0.04, 12, 32)
  ballRingGeo.rotateX(Math.PI / 2)
  const ballRingMesh = new THREE.Mesh(ballRingGeo, steelMat)
  ballRingMesh.position.set(-bayWidth, -0.5, 0)
  ballRingMesh.castShadow = true
  lockerGroup.add(ballRingMesh)

  // Pedestal base cylinder
  const pedestalGeo = new THREE.CylinderGeometry(0.42, 0.46, 0.1, 32)
  const pedestalMesh = new THREE.Mesh(pedestalGeo, woodMat)
  pedestalMesh.position.set(-bayWidth, -0.55, 0)
  pedestalMesh.receiveShadow = true
  lockerGroup.add(pedestalMesh)

  // ─── 4. BAY 2 (CENTER): SNEAKER SHELF ───
  // Angled display shoe stand
  const shoeStandGeo = new THREE.BoxGeometry(1.2, 0.06, 0.7)
  shoeStandGeo.rotateX(0.12)
  const shoeStandMesh = new THREE.Mesh(shoeStandGeo, woodMat)
  shoeStandMesh.position.set(0, -0.5, 0)
  shoeStandMesh.castShadow = true
  shoeStandMesh.receiveShadow = true
  lockerGroup.add(shoeStandMesh)

  // ─── 5. BAY 3 (RIGHT): WHISTLE HOOK & PEG ───
  // Metallic locker peg for hanging
  const pegBaseGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16)
  pegBaseGeo.rotateX(Math.PI / 2)
  const pegBaseMesh = new THREE.Mesh(pegBaseGeo, steelMat)
  pegBaseMesh.position.set(bayWidth, 0.85, -lockerDepth / 2 + 0.08)
  lockerGroup.add(pegBaseMesh)

  const pegRodGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.25, 16)
  pegRodGeo.rotateX(Math.PI / 2)
  const pegRodMesh = new THREE.Mesh(pegRodGeo, steelMat)
  pegRodMesh.position.set(bayWidth, 0.85, -lockerDepth / 2 + 0.2)
  pegRodMesh.castShadow = true
  lockerGroup.add(pegRodMesh)

  const pegTipGeo = new THREE.SphereGeometry(0.045, 16, 16)
  const pegTipMesh = new THREE.Mesh(pegTipGeo, brassMat)
  pegTipMesh.position.set(bayWidth, 0.88, -lockerDepth / 2 + 0.32)
  lockerGroup.add(pegTipMesh)

  // ─── 6. NAMEPLATES UNDER EACH BAY ───
  const createBayTag = (x: number, label: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, 256, 64)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 4
    ctx.strokeRect(4, 4, 248, 56)
    ctx.fillStyle = '#f8fafc'
    ctx.font = 'bold 26px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, 128, 32)

    const tex = new THREE.CanvasTexture(canvas)
    const plateGeo = new THREE.PlaneGeometry(0.7, 0.18)
    const plateMat = new THREE.MeshBasicMaterial({ map: tex })
    const plateMesh = new THREE.Mesh(plateGeo, plateMat)
    plateMesh.position.set(x, -0.9, 0.45)
    lockerGroup.add(plateMesh)
  }

  createBayTag(-bayWidth, '⚽ FÚTBOL')
  createBayTag(0, '👟 ZAPA URBANA')
  createBayTag(bayWidth, '💖 SILBATO')

  // ─── 7. COACH TACTICAL WHITEBOARD ON LEFT WALL ───
  const boardCanvas = document.createElement('canvas')
  boardCanvas.width = 512
  boardCanvas.height = 384
  const bCtx = boardCanvas.getContext('2d')!
  bCtx.fillStyle = '#ffffff'
  bCtx.fillRect(0, 0, 512, 384)
  // Field soccer half markings
  bCtx.strokeStyle = '#22c55e'
  bCtx.lineWidth = 4
  bCtx.strokeRect(20, 20, 472, 344)
  bCtx.beginPath()
  bCtx.arc(256, 20, 80, 0, Math.PI)
  bCtx.stroke()
  // Coach notes
  bCtx.fillStyle = '#0f172a'
  bCtx.font = 'bold 24px sans-serif'
  bCtx.fillText('PROFE NAILA 📋', 40, 60)
  bCtx.fillStyle = '#e11d48'
  bCtx.font = 'bold 28px sans-serif'
  bCtx.fillText('¡VAMOS LOS GORDITOS! 🌟', 40, 320)
  bCtx.font = '18px sans-serif'
  bCtx.fillStyle = '#2563eb'
  bCtx.fillText('Fútbol · Hockey · Pádel', 40, 95)
  // Tactic arrows
  bCtx.strokeStyle = '#dc2626'
  bCtx.lineWidth = 3
  bCtx.beginPath()
  bCtx.moveTo(120, 160)
  bCtx.lineTo(240, 220)
  bCtx.lineTo(380, 180)
  bCtx.stroke()

  const boardTex = new THREE.CanvasTexture(boardCanvas)
  const boardGeo = new THREE.BoxGeometry(0.08, 1.8, 2.4)
  const boardMat = new THREE.MeshStandardMaterial({
    map: boardTex,
    roughness: 0.2,
  })
  const boardMesh = new THREE.Mesh(boardGeo, boardMat)
  boardMesh.position.set(-lockerWidth / 2 - 0.2, 0.4, 0.1)
  boardMesh.castShadow = true
  lockerGroup.add(boardMesh)

  // ─── 8. FIELD HOCKEY STICK & BALL ───
  // Composite hockey stick leaning on the right side of locker
  const stickGroup = new THREE.Group()
  stickGroup.position.set(lockerWidth / 2 + 0.25, -0.6, 0.3)
  stickGroup.rotation.z = -0.18
  stickGroup.rotation.y = 0.2

  // Shaft of hockey stick
  const stickShaftGeo = new THREE.CylinderGeometry(0.035, 0.04, 2.2, 16)
  const stickMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9, // Bright turquoise/cyan sports composite
    roughness: 0.3,
    metalness: 0.2,
  })
  const stickShaft = new THREE.Mesh(stickShaftGeo, stickMat)
  stickShaft.castShadow = true
  stickGroup.add(stickShaft)

  // Hockey stick grip tape (pink grip at the handle)
  const gripGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.9, 16)
  const gripMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e, // Hot pink grip tape
    roughness: 0.8,
  })
  const gripMesh = new THREE.Mesh(gripGeo, gripMat)
  gripMesh.position.y = 0.65
  stickGroup.add(gripMesh)

  // Curved hockey stick toe head
  const headCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -1.05, 0),
    new THREE.Vector3(0.08, -1.18, 0),
    new THREE.Vector3(0.24, -1.14, 0),
    new THREE.Vector3(0.28, -0.98, 0),
  ])
  const headGeo = new THREE.TubeGeometry(headCurve, 16, 0.045, 12, false)
  const headMesh = new THREE.Mesh(headGeo, stickMat)
  headMesh.castShadow = true
  stickGroup.add(headMesh)

  lockerGroup.add(stickGroup)

  // Dimpled white hockey turf ball
  const hockeyBallGeo = new THREE.SphereGeometry(0.12, 16, 16)
  const hockeyBallMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
  })
  const hockeyBall = new THREE.Mesh(hockeyBallGeo, hockeyBallMat)
  hockeyBall.position.set(lockerWidth / 2 + 0.4, -lockerHeight / 2 + 0.2, 0.5)
  hockeyBall.castShadow = true
  lockerGroup.add(hockeyBall)

  envGroup.add(lockerGroup)

  // ─── 9. PANORAMIC SPORTS CAMPUS WINDOW (BACKGROUND) ───
  // Window frame cutting through back wall on top-right
  const winGroup = new THREE.Group()
  winGroup.position.set(3.5, 2.2, -3.8)

  const winFrameGeo = new THREE.BoxGeometry(4.2, 2.6, 0.1)
  const winFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })
  const winFrame = new THREE.Mesh(winFrameGeo, winFrameMat)
  winGroup.add(winFrame)

  // Sports campus scenery inside window
  const sceneCanvas = document.createElement('canvas')
  sceneCanvas.width = 1024
  sceneCanvas.height = 640
  const sCtx = sceneCanvas.getContext('2d')!

  // Sky gradient (sunny Argentine morning)
  const skyGrad = sCtx.createLinearGradient(0, 0, 0, 360)
  skyGrad.addColorStop(0, '#38bdf8')
  skyGrad.addColorStop(0.6, '#bae6fd')
  skyGrad.addColorStop(1, '#fef08a')
  sCtx.fillStyle = skyGrad
  sCtx.fillRect(0, 0, 1024, 360)

  // Bright morning sun
  sCtx.fillStyle = '#fef9c3'
  sCtx.beginPath()
  sCtx.arc(780, 100, 50, 0, Math.PI * 2)
  sCtx.fill()

  // Distant school sports grandstand & trees
  sCtx.fillStyle = '#15803d'
  for (let i = 0; i < 18; i++) {
    sCtx.beginPath()
    sCtx.arc(40 + i * 58, 340, 45, 0, Math.PI * 2)
    sCtx.fill()
  }

  // Soccer field (vibrant green lawn)
  const lawnGrad = sCtx.createLinearGradient(0, 340, 0, 640)
  lawnGrad.addColorStop(0, '#22c55e')
  lawnGrad.addColorStop(1, '#16a34a')
  sCtx.fillStyle = lawnGrad
  sCtx.fillRect(0, 340, 1024, 300)

  // Soccer field white lines
  sCtx.strokeStyle = 'rgba(255,255,255,0.85)'
  sCtx.lineWidth = 4
  sCtx.strokeRect(80, 400, 400, 200)
  sCtx.beginPath()
  sCtx.arc(480, 500, 60, 0, Math.PI * 2)
  sCtx.stroke()

  // Soccer goalposts
  sCtx.strokeStyle = '#ffffff'
  sCtx.lineWidth = 6
  sCtx.strokeRect(80, 440, 40, 120)

  // Hockey turf (blue/turquoise turf section)
  sCtx.fillStyle = '#0284c7'
  sCtx.fillRect(560, 410, 420, 190)
  sCtx.strokeStyle = 'rgba(255,255,255,0.8)'
  sCtx.lineWidth = 3
  sCtx.strokeRect(570, 420, 400, 170)

  // Orange training cones on the turf
  const coneColors = ['#f97316', '#ea580c', '#fb923c']
  for (let i = 0; i < 6; i++) {
    sCtx.fillStyle = coneColors[i % 3]
    sCtx.beginPath()
    sCtx.moveTo(600 + i * 65, 520)
    sCtx.lineTo(612 + i * 65, 495)
    sCtx.lineTo(624 + i * 65, 520)
    sCtx.closePath()
    sCtx.fill()
  }

  // Cheerful children ("los gorditos") practicing sports in the distance
  sCtx.fillStyle = '#1e293b'
  const kidXs = [240, 275, 330, 710, 750, 810]
  kidXs.forEach((kx, idx) => {
    // Head
    sCtx.beginPath()
    sCtx.arc(kx, 460 + (idx % 2) * 10, 6, 0, Math.PI * 2)
    sCtx.fill()
    // Body running
    sCtx.lineWidth = 3
    sCtx.strokeStyle = idx % 2 === 0 ? '#ef4444' : '#3b82f6'
    sCtx.beginPath()
    sCtx.moveTo(kx, 466 + (idx % 2) * 10)
    sCtx.lineTo(kx, 482 + (idx % 2) * 10)
    sCtx.lineTo(kx - 6, 495 + (idx % 2) * 10)
    sCtx.moveTo(kx, 482 + (idx % 2) * 10)
    sCtx.lineTo(kx + 6, 495 + (idx % 2) * 10)
    sCtx.stroke()
  })

  const sceneTex = new THREE.CanvasTexture(sceneCanvas)
  const winGlassGeo = new THREE.PlaneGeometry(4.0, 2.4)
  const winGlassMat = new THREE.MeshBasicMaterial({ map: sceneTex })
  const winGlass = new THREE.Mesh(winGlassGeo, winGlassMat)
  winGlass.position.z = -0.04
  winGroup.add(winGlass)

  envGroup.add(winGroup)

  // ─── 10. LIGHTING RIG (HD PBR Studio + Warm Locker Spotlights) ───
  // Key warm sunlight coming through the window
  const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.6)
  sunLight.position.set(5, 7, 3)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.width = 2048
  sunLight.shadow.mapSize.height = 2048
  sunLight.shadow.bias = -0.0005
  sunLight.shadow.camera.near = 1
  sunLight.shadow.camera.far = 20
  sunLight.shadow.camera.left = -6
  sunLight.shadow.camera.right = 6
  sunLight.shadow.camera.top = 6
  sunLight.shadow.camera.bottom = -4
  envGroup.add(sunLight)

  // Soft sky blue fill light from the side
  const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.7)
  fillLight.position.set(-4, 3, 4)
  envGroup.add(fillLight)

  // Ambient light for soft shadows
  const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.8)
  envGroup.add(ambientLight)

  // Dedicated spotlights for each locker bay
  const createSpotlight = (x: number): THREE.SpotLight => {
    const spot = new THREE.SpotLight(0xffedd5, 1.2, 8, Math.PI / 6, 0.4, 1.5)
    spot.position.set(x, 1.6, -0.8)
    spot.target.position.set(x, 0, -1.6)
    spot.castShadow = true
    lockerGroup.add(spot.target)
    lockerGroup.add(spot)
    return spot
  }

  const spotlights = {
    football: createSpotlight(-bayWidth),
    sneaker: createSpotlight(0),
    whistle: createSpotlight(bayWidth),
  }

  return { group: envGroup, targetPositions, spotlights }
}
