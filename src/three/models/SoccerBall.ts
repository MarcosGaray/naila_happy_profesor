import * as THREE from 'three'

/**
 * Creates the classic black & white soccer ball matching the user reference photo.
 * Generates an HD procedural canvas texture with pentagonal and hexagonal patches,
 * stitched seam indents, and leather grain highlights.
 */
export function createSoccerBall(): THREE.Group {
  const group = new THREE.Group()
  group.name = 'soccer-ball'

  // Procedural HD soccer ball texture
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  // Base white leather
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Leather subtle noise/grain
  ctx.fillStyle = 'rgba(0,0,0,0.025)'
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    ctx.fillRect(x, y, 2, 2)
  }

  // Draw soccer patches grid on equirectangular projection
  const cols = 8
  const rows = 4
  const cellW = canvas.width / cols
  const cellH = canvas.height / rows

  // Function to draw a shaded polygon (pentagon or hexagon)
  const drawPatch = (
    cx: number,
    cy: number,
    radius: number,
    sides: number,
    isBlack: boolean,
    rotation: number = 0
  ) => {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rotation)
    ctx.beginPath()

    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()

    if (isBlack) {
      // Shaded black leather patch (deep charcoal with soft gradient)
      const grad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, radius * 0.1, 0, 0, radius)
      grad.addColorStop(0, '#2d3748')
      grad.addColorStop(0.7, '#1a202c')
      grad.addColorStop(1, '#0f172a')
      ctx.fillStyle = grad
      ctx.fill()

      // Subtle inner shine
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 2
      ctx.stroke()
    } else {
      // White patch soft shading
      const grad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, radius * 0.1, 0, 0, radius)
      grad.addColorStop(0, '#ffffff')
      grad.addColorStop(0.8, '#edf2f7')
      grad.addColorStop(1, '#cbd5e1')
      ctx.fillStyle = grad
      ctx.fill()
    }

    // Seam outline (stitched leather look)
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 4
    ctx.lineJoin = 'round'
    ctx.stroke()

    // Tiny stitch marks
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.restore()
  }

  // Generate alternating pattern of patches
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = (c + (r % 2 === 0 ? 0.5 : 0)) * cellW
      const cy = (r + 0.5) * cellH
      const isBlack = (r + c) % 2 === 0
      drawPatch(cx, cy, cellH * 0.42, isBlack ? 5 : 6, isBlack, isBlack ? 0.2 : 0)
      if (cx > canvas.width) {
        drawPatch(cx - canvas.width, cy, cellH * 0.42, isBlack ? 5 : 6, isBlack, isBlack ? 0.2 : 0)
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping

  // Bump map for realistic 3D seams
  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = 1024
  bumpCanvas.height = 512
  const bCtx = bumpCanvas.getContext('2d')!
  bCtx.fillStyle = '#808080'
  bCtx.fillRect(0, 0, bumpCanvas.width, bumpCanvas.height)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = (c + (r % 2 === 0 ? 0.5 : 0)) * cellW
      const cy = (r + 0.5) * cellH
      const isBlack = (r + c) % 2 === 0

      bCtx.save()
      bCtx.translate(cx, cy)
      bCtx.beginPath()
      const sides = isBlack ? 5 : 6
      const radius = cellH * 0.42
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        if (i === 0) bCtx.moveTo(x, y)
        else bCtx.lineTo(x, y)
      }
      bCtx.closePath()
      // Raised patch center, recessed seams
      bCtx.fillStyle = '#a0a0a0'
      bCtx.fill()
      bCtx.strokeStyle = '#303030'
      bCtx.lineWidth = 5
      bCtx.stroke()
      bCtx.restore()
    }
  }
  const bumpTexture = new THREE.CanvasTexture(bumpCanvas)
  bumpTexture.wrapS = THREE.RepeatWrapping

  const ballGeo = new THREE.SphereGeometry(0.7, 48, 48)
  const ballMat = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: bumpTexture,
    bumpScale: 0.03,
    roughness: 0.35,
    metalness: 0.05,
    envMapIntensity: 0.6,
  })

  const ballMesh = new THREE.Mesh(ballGeo, ballMat)
  ballMesh.castShadow = true
  ballMesh.receiveShadow = true
  ballMesh.name = 'soccer-ball-mesh'

  group.add(ballMesh)

  // Subtle gloss sheen rim
  return group
}
