import * as THREE from 'three'

/**
 * Creates an authentic, sleek, high-fidelity 3D model of the Nike Air Jordan 1 Low "Panda"
 * matching the user reference photo:
 * - Organic, aerodynamic shoe last with smooth curvature (no blocky boxes)
 * - White perforated leather toe box with realistic ventilation dots
 * - Jet black smooth leather overlays (mudguard, eyestay, heel counter, collar)
 * - Authentic sweeping black leather Swoosh with stitched bevel
 * - White rubber midsole with perimeter groove + black traction outsole
 * - Padded white tongue with black Nike woven label & 3D criss-crossing black flat laces
 * - Anatomically curved low collar with dark padded sockliner
 */
export function createJordanShoe(): THREE.Group {
  const shoe = new THREE.Group()
  shoe.name = 'jordan-1-low-panda'

  // ─── 1. PROCEDURAL HD TEXTURE (Exact Panda Panel Layout & Stitching) ───
  const texCanvas = document.createElement('canvas')
  texCanvas.width = 2048
  texCanvas.height = 1024
  const ctx = texCanvas.getContext('2d')!

  // Base background: premium white tumbled leather
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, texCanvas.width, texCanvas.height)

  // Leather micro-grain texture
  ctx.fillStyle = 'rgba(0, 0, 0, 0.015)'
  for (let i = 0; i < 20000; i++) {
    const rx = Math.random() * texCanvas.width
    const ry = Math.random() * texCanvas.height
    ctx.fillRect(rx, ry, 2, 2)
  }

  // Helper for stitching lines
  const drawStitchLine = (points: [number, number][]) => {
    ctx.save()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 5])
    ctx.beginPath()
    points.forEach(([x, y], idx) => {
      if (idx === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
    ctx.restore()
  }

  // ─── UV MAP REGIONS (U = 0 to 1 along length, V = 0 to 1 around circumference) ───
  // V = 0.5 is top ridge (tongue & toe center).
  // V < 0.5 is lateral (outer) side; V > 0.5 is medial (inner) side.
  // U = 0 is heel back; U = 1 is toe tip.

  // 1.1 BLACK MUDGUARD (Toe Cap & Surround)
  // Covers U = 0.78 to 1.0 on the perimeter, wrapping around the toe
  ctx.fillStyle = '#111827' // Deep jet black leather
  ctx.beginPath()
  ctx.moveTo(1500, 100)
  ctx.bezierCurveTo(1650, 150, 2048, 200, 2048, 512)
  ctx.bezierCurveTo(2048, 824, 1650, 874, 1500, 924)
  ctx.lineTo(1650, 720)
  ctx.bezierCurveTo(1750, 680, 1920, 620, 1920, 512)
  ctx.bezierCurveTo(1920, 404, 1750, 344, 1650, 304)
  ctx.closePath()
  ctx.fill()

  // Mudguard double stitching
  drawStitchLine([
    [1520, 120],
    [1660, 314],
    [1760, 354],
    [1910, 414],
    [1910, 512],
    [1910, 610],
    [1760, 670],
    [1660, 710],
    [1520, 904],
  ])

  // 1.2 WHITE TOE BOX PERFORATIONS (U = 0.75 to 0.95, Center V = 0.4 to 0.6)
  ctx.fillStyle = '#cbd5e1'
  const centerU = 1750
  const centerV = 512
  for (let ring = 1; ring <= 5; ring++) {
    const dots = ring * 4
    const radX = ring * 26
    const radY = ring * 32
    for (let d = 0; d < dots; d++) {
      const angle = (d * Math.PI * 2) / dots
      const px = centerU + Math.cos(angle) * radX
      const py = centerV + Math.sin(angle) * radY
      if (px > 1640 && px < 1900 && py > 340 && py < 684) {
        ctx.beginPath()
        ctx.arc(px, py, 3.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // 1.3 BLACK EYESTAYS (Lacing strip)
  // Strips along the instep framing the tongue
  ctx.fillStyle = '#111827'
  // Lateral eyestay (top half of UV, V ~ 0.3)
  ctx.beginPath()
  ctx.moveTo(900, 300)
  ctx.lineTo(1520, 300)
  ctx.lineTo(1480, 380)
  ctx.lineTo(950, 420)
  ctx.closePath()
  ctx.fill()
  drawStitchLine([[910, 310], [1510, 310], [1470, 370], [960, 410], [910, 310]])

  // Medial eyestay (bottom half of UV, V ~ 0.7)
  ctx.beginPath()
  ctx.moveTo(900, 724)
  ctx.lineTo(1520, 724)
  ctx.lineTo(1480, 644)
  ctx.lineTo(950, 604)
  ctx.closePath()
  ctx.fill()
  drawStitchLine([[910, 714], [1510, 714], [1470, 654], [960, 614], [910, 714]])

  // Eyelet punched grommets
  ctx.fillStyle = '#1f2937'
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 3
  for (let e = 0; e < 6; e++) {
    const ex = 1000 + e * 90
    // Lateral
    ctx.beginPath()
    ctx.arc(ex, 345, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    // Medial
    ctx.beginPath()
    ctx.arc(ex, 679, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }

  // 1.4 BLACK HEEL COUNTER & LOWER HEEL OVERLAY (U = 0 to 0.45)
  ctx.fillStyle = '#111827'
  ctx.beginPath()
  ctx.moveTo(0, 50)
  ctx.lineTo(850, 180)
  ctx.bezierCurveTo(800, 280, 700, 320, 600, 320)
  ctx.lineTo(0, 320)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(0, 974)
  ctx.lineTo(850, 844)
  ctx.bezierCurveTo(800, 744, 700, 704, 600, 704)
  ctx.lineTo(0, 704)
  ctx.closePath()
  ctx.fill()

  // Heel center back wrap
  ctx.fillRect(0, 260, 500, 504)

  // 1.5 WHITE JORDAN WINGS LOGO ON HEEL TAB (U ~ 0.08, Center V = 0.5)
  ctx.save()
  ctx.translate(140, 512)
  ctx.rotate(-Math.PI / 2)
  ctx.strokeStyle = '#f8fafc'
  ctx.lineWidth = 3
  // Basketball center
  ctx.beginPath()
  ctx.arc(0, 0, 18, 0, Math.PI * 2)
  ctx.stroke()
  // Wings spread
  ctx.beginPath()
  ctx.moveTo(-50, -6)
  ctx.quadraticCurveTo(-20, -18, 0, -18)
  ctx.quadraticCurveTo(20, -18, 50, -6)
  ctx.quadraticCurveTo(25, 4, 0, 4)
  ctx.quadraticCurveTo(-25, 4, -50, -6)
  ctx.stroke()
  ctx.restore()

  // 1.6 BLACK SWOOSH LOGOS (Sweeping across lateral and medial white quarter)
  const drawSwooshOnTex = (isLateral: boolean) => {
    ctx.save()
    ctx.fillStyle = '#111827'
    const baseY = isLateral ? 240 : 784
    const dir = isLateral ? 1 : -1

    ctx.beginPath()
    // Swoosh tail starts near heel collar
    ctx.moveTo(350, baseY - 60 * dir)
    // Swoosh upper curve
    ctx.bezierCurveTo(600, baseY + 10 * dir, 950, baseY + 30 * dir, 1250, baseY + 10 * dir)
    // Swoosh tip
    ctx.lineTo(1270, baseY + 5 * dir)
    // Swoosh lower belly curve
    ctx.bezierCurveTo(980, baseY + 95 * dir, 650, baseY + 80 * dir, 350, baseY - 50 * dir)
    ctx.closePath()
    ctx.fill()

    // Swoosh white edge stitching
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = 2
    ctx.setLineDash([4, 4])
    ctx.stroke()
    ctx.restore()
  }
  drawSwooshOnTex(true)
  drawSwooshOnTex(false)

  // 1.7 BLACK ANKLE COLLAR RIM (U = 0 to 0.45 at the top)
  ctx.fillStyle = '#111827'
  ctx.fillRect(0, 0, 800, 90)
  ctx.fillRect(0, 934, 800, 90)

  const upperTexture = new THREE.CanvasTexture(texCanvas)
  upperTexture.wrapS = THREE.ClampToEdgeWrapping
  upperTexture.wrapT = THREE.ClampToEdgeWrapping

  // Bump map for leather grain and stitching relief
  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = 1024
  bumpCanvas.height = 512
  const bCtx = bumpCanvas.getContext('2d')!
  bCtx.fillStyle = '#808080'
  bCtx.fillRect(0, 0, 1024, 512)
  // Contrast lines on seams
  bCtx.drawImage(texCanvas, 0, 0, 1024, 512)
  const bumpTex = new THREE.CanvasTexture(bumpCanvas)

  // ─── 2. PROCEDURAL ORGANIC SNEAKER UPPER (Lofted Athletic Last) ───
  // Creates a continuous curved hull with smooth vertex normals
  const uSegments = 36
  const vSegments = 24
  const upperGeo = new THREE.BufferGeometry()

  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  // Anatomical profile functions
  for (let i = 0; i <= uSegments; i++) {
    const u = i / uSegments
    // X axis goes from heel (-1.1) to toe (+1.15)
    const x = -1.1 + u * 2.25

    // Top ridge curve Y (heel collar -> instep slope -> toe dome -> toe tip)
    let yTop = 0.52
    if (u < 0.18) {
      // Heel tab
      yTop = 0.54 + Math.sin(u / 0.18 * Math.PI * 0.5) * 0.08
    } else if (u < 0.42) {
      // Collar dip & ankle opening
      const t = (u - 0.18) / 0.24
      yTop = 0.62 - t * 0.12
    } else if (u < 0.72) {
      // Instep slope where laces lie
      const t = (u - 0.42) / 0.30
      yTop = 0.50 - t * 0.16
    } else {
      // Aerodynamic curved toe box
      const t = (u - 0.72) / 0.28
      yTop = 0.34 - Math.sin(t * Math.PI * 0.5) * 0.18
    }

    // Sole line Y with athletic toe spring (toe curls gently upward at the tip)
    let yBottom = 0.08
    if (u > 0.65) {
      const t = (u - 0.65) / 0.35
      yBottom = 0.08 + Math.pow(t, 2) * 0.08 // Toe rocker
    }

    // Half-width profile Z (narrow heel, slim contoured waist at arch, wide ball of foot, tapered toe)
    let w = 0.26
    if (u < 0.25) {
      w = 0.24 + Math.sin(u / 0.25 * Math.PI) * 0.06 // Heel
    } else if (u < 0.5) {
      w = 0.28 - (u - 0.25) / 0.25 * 0.04 // Athletic narrow waist
    } else if (u < 0.8) {
      const t = (u - 0.5) / 0.3
      w = 0.24 + Math.sin(t * Math.PI * 0.5) * 0.14 // Widest at forefoot (0.38)
    } else {
      const t = (u - 0.8) / 0.2
      w = 0.38 * (1.0 - Math.pow(t, 1.4) * 0.75) // Gracefully tapered round toe
    }

    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments
      const theta = v * Math.PI

      // Radial contour across the cross-section
      const p = 0.72 // Superellipse exponent for athletic sneaker fullness
      const sinTheta = Math.sin(theta)
      const cosTheta = Math.cos(theta)

      const y = yBottom + (yTop - yBottom) * Math.pow(Math.max(0, sinTheta), p)
      const z = -w * cosTheta

      positions.push(x, y, z)
      uvs.push(u, v)
    }
  }

  // Generate quad-based indices
  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * (vSegments + 1) + j
      const b = (i + 1) * (vSegments + 1) + j
      const c = (i + 1) * (vSegments + 1) + (j + 1)
      const d = i * (vSegments + 1) + (j + 1)

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  upperGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  upperGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  upperGeo.setIndex(indices)
  upperGeo.computeVertexNormals()

  const upperMat = new THREE.MeshStandardMaterial({
    map: upperTexture,
    bumpMap: bumpTex,
    bumpScale: 0.02,
    roughness: 0.32,
    metalness: 0.06,
  })

  const upperMesh = new THREE.Mesh(upperGeo, upperMat)
  upperMesh.castShadow = true
  upperMesh.receiveShadow = true
  shoe.add(upperMesh)

  // ─── 3. AUTHENTIC NIKE AIR SOLE (Midsole + Outsole) ───
  // Smooth contoured boundary matching the upper base
  const solePath = new THREE.Shape()
  const solePoints: [number, number][] = [
    [-1.12, 0],
    [-1.08, 0.22],
    [-0.8, 0.28],
    [-0.4, 0.24],
    [0.0, 0.26],
    [0.4, 0.36],
    [0.7, 0.39],
    [1.0, 0.32],
    [1.16, 0.14],
    [1.18, 0],
    [1.16, -0.14],
    [1.0, -0.32],
    [0.7, -0.38],
    [0.4, -0.34],
    [0.0, -0.24],
    [-0.4, -0.23],
    [-0.8, -0.28],
    [-1.08, -0.22],
    [-1.12, 0],
  ]
  solePath.moveTo(solePoints[0][0], solePoints[0][1])
  for (let p = 1; p < solePoints.length; p++) {
    solePath.lineTo(solePoints[p][0], solePoints[p][1])
  }

  // 3.1 White Rubber Midsole (Jordan 1 stitched sidewall)
  const midsoleCanvas = document.createElement('canvas')
  midsoleCanvas.width = 512
  midsoleCanvas.height = 64
  const mCtx = midsoleCanvas.getContext('2d')!
  mCtx.fillStyle = '#f1f5f9'
  mCtx.fillRect(0, 0, 512, 64)
  // Horizontal stitching groove
  mCtx.strokeStyle = '#94a3b8'
  mCtx.lineWidth = 3
  mCtx.beginPath()
  mCtx.moveTo(0, 18)
  mCtx.lineTo(512, 18)
  mCtx.stroke()
  // White nylon stitching thread
  mCtx.strokeStyle = '#ffffff'
  mCtx.lineWidth = 2
  mCtx.setLineDash([8, 6])
  mCtx.stroke()
  const midsoleTex = new THREE.CanvasTexture(midsoleCanvas)
  midsoleTex.wrapS = THREE.RepeatWrapping

  const midsoleGeo = new THREE.ExtrudeGeometry(solePath, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  })
  midsoleGeo.rotateX(Math.PI / 2)
  const midsoleMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    map: midsoleTex,
    roughness: 0.75,
    metalness: 0.02,
  })
  const midsoleMesh = new THREE.Mesh(midsoleGeo, midsoleMat)
  midsoleMesh.position.y = 0.06
  midsoleMesh.castShadow = true
  midsoleMesh.receiveShadow = true
  shoe.add(midsoleMesh)

  // 3.2 Black Rubber Outsole
  const outsoleGeo = new THREE.ExtrudeGeometry(solePath, {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.01,
    bevelThickness: 0.01,
  })
  outsoleGeo.rotateX(Math.PI / 2)
  const outsoleMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.9,
    metalness: 0.01,
  })
  const outsoleMesh = new THREE.Mesh(outsoleGeo, outsoleMat)
  outsoleMesh.position.y = -0.09
  outsoleMesh.castShadow = true
  outsoleMesh.receiveShadow = true
  shoe.add(outsoleMesh)

  // ─── 4. PADDED WHITE TONGUE & BLACK JUMPMAN TAG ───
  // Soft curved tongue rising from the instep
  const tongueCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.5, 0.42, 0),
    new THREE.Vector3(0.2, 0.52, 0),
    new THREE.Vector3(-0.05, 0.62, 0),
    new THREE.Vector3(-0.25, 0.70, 0),
  ])
  const tongueGeo = new THREE.TubeGeometry(tongueCurve, 18, 0.18, 12, false)
  tongueGeo.scale(1, 0.35, 1)
  const tongueMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.6,
  })
  const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat)
  shoe.add(tongueMesh)

  // Black woven label on top of tongue
  const tagGeo = new THREE.BoxGeometry(0.12, 0.02, 0.22)
  tagGeo.rotateZ(0.35)
  const tagMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.8,
  })
  const tagMesh = new THREE.Mesh(tagGeo, tagMat)
  tagMesh.position.set(-0.24, 0.72, 0)
  shoe.add(tagMesh)

  // ─── 5. REAL 3D FLAT BLACK LACES (Criss-Crossing) ───
  const lacesMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0c,
    roughness: 0.9,
  })

  // 5 pairs of flat lace ribbons crossing over the tongue
  const eyeletX = [0.45, 0.32, 0.18, 0.04, -0.10]
  const eyeletY = [0.42, 0.47, 0.52, 0.58, 0.64]
  const eyeletW = [0.24, 0.23, 0.22, 0.20, 0.19]

  for (let k = 0; k < eyeletX.length; k++) {
    // Horizontal bridge
    const laceBarGeo = new THREE.BoxGeometry(0.04, 0.015, eyeletW[k] * 2)
    laceBarGeo.rotateZ(0.25)
    const laceBar = new THREE.Mesh(laceBarGeo, lacesMat)
    laceBar.position.set(eyeletX[k], eyeletY[k], 0)
    shoe.add(laceBar)

    // Diagonal criss-cross
    if (k < eyeletX.length - 1) {
      const diagCurveL = new THREE.CatmullRomCurve3([
        new THREE.Vector3(eyeletX[k], eyeletY[k], -eyeletW[k]),
        new THREE.Vector3((eyeletX[k] + eyeletX[k + 1]) / 2, (eyeletY[k] + eyeletY[k + 1]) / 2 + 0.015, 0),
        new THREE.Vector3(eyeletX[k + 1], eyeletY[k + 1], eyeletW[k + 1]),
      ])
      const diagGeoL = new THREE.TubeGeometry(diagCurveL, 10, 0.016, 6, false)
      const diagMeshL = new THREE.Mesh(diagGeoL, lacesMat)
      shoe.add(diagMeshL)

      const diagCurveR = new THREE.CatmullRomCurve3([
        new THREE.Vector3(eyeletX[k], eyeletY[k], eyeletW[k]),
        new THREE.Vector3((eyeletX[k] + eyeletX[k + 1]) / 2, (eyeletY[k] + eyeletY[k + 1]) / 2 + 0.02, 0),
        new THREE.Vector3(eyeletX[k + 1], eyeletY[k + 1], -eyeletW[k + 1]),
      ])
      const diagGeoR = new THREE.TubeGeometry(diagCurveR, 10, 0.016, 6, false)
      const diagMeshR = new THREE.Mesh(diagGeoR, lacesMat)
      shoe.add(diagMeshR)
    }
  }

  // ─── 6. ANKLE COLLAR OPENING & LINING ───
  // Soft black padded collar lining
  const collarPoints = [
    new THREE.Vector3(-0.75, 0.58, 0), // Heel notch
    new THREE.Vector3(-0.55, 0.48, -0.22), // Lateral ankle dip
    new THREE.Vector3(-0.25, 0.62, -0.18), // Front instep
    new THREE.Vector3(-0.25, 0.62, 0.18),
    new THREE.Vector3(-0.55, 0.48, 0.22), // Medial ankle dip
    new THREE.Vector3(-0.75, 0.58, 0),
  ]
  const collarCurve = new THREE.CatmullRomCurve3(collarPoints, true)
  const collarGeo = new THREE.TubeGeometry(collarCurve, 24, 0.038, 8, true)
  const collarMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.85,
  })
  const collarMesh = new THREE.Mesh(collarGeo, collarMat)
  collarMesh.castShadow = true
  shoe.add(collarMesh)

  // Inner foot cavity (dark breathable mesh sockliner)
  const cavityGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.28, 16)
  const cavityMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95 })
  const cavityMesh = new THREE.Mesh(cavityGeo, cavityMat)
  cavityMesh.position.set(-0.48, 0.44, 0)
  shoe.add(cavityMesh)

  // ─── 7. PROPORTIONS, SCALE & DISPLAY ORIENTATION ───
  // Realistic sneaker length and angle on the locker shoe rack
  shoe.scale.set(0.85, 0.85, 0.85)
  // Display at a 3/4 beauty angle to showcase the Swoosh, toe perforations, and panda panels
  shoe.rotation.y = Math.PI * 0.22
  shoe.rotation.x = 0.04

  return shoe
}
