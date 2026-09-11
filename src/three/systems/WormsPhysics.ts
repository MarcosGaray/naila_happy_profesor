import * as THREE from 'three'

export interface AnimatedItem {
  id: 'football' | 'sneaker' | 'whistle'
  mesh: THREE.Group
  targetPos: THREE.Vector3
  placed: boolean
  flying: boolean
  flyProgress: number
  startPos: THREE.Vector3
  midArcHeight: number
  squashTime: number
  wobblePhase: number
}

/**
 * Manages Worms 3D-style animated physics:
 * - Parabolic ballistic trajectory with dynamic tumbling
 * - Elastic Squash & Stretch upon landing (spring physics)
 * - Organic idle bobbing and pendulum swinging
 * - Particle bursts on impact (gold stars, electric bolts, floating hearts)
 * - 3D floating dynamic popup banners ("DIVERSIÓN ✨", "ENERGÍA ⚡", "AMOR 💗")
 */
export class WormsPhysicsSystem {
  private items: Map<string, AnimatedItem> = new Map()
  private scene: THREE.Scene
  private particleGroup: THREE.Group
  private particles: {
    mesh: THREE.Mesh
    vel: THREE.Vector3
    rotSpeed: THREE.Vector3
    life: number
    maxLife: number
  }[] = []
  private badges: Map<string, THREE.Mesh> = new Map()

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.particleGroup = new THREE.Group()
    this.particleGroup.name = 'physics-particles'
    this.scene.add(this.particleGroup)
  }

  registerItem(
    id: 'football' | 'sneaker' | 'whistle',
    mesh: THREE.Group,
    targetPos: THREE.Vector3,
    startPos: THREE.Vector3
  ) {
    this.items.set(id, {
      id,
      mesh,
      targetPos,
      placed: false,
      flying: false,
      flyProgress: 0,
      startPos: startPos.clone(),
      midArcHeight: 2.2,
      squashTime: -1,
      wobblePhase: Math.random() * Math.PI * 2,
    })
    mesh.position.copy(startPos)
  }

  /**
   * True while any ballistic flight, squash landing or particle burst is active.
   * Used by the renderer to throttle frames when the scene is settled.
   */
  public isBusy(): boolean {
    if (this.particles.length > 0) return true
    for (const item of this.items.values()) {
      if (item.flying) return true
      if (item.squashTime >= 0 && item.squashTime < 1.2) return true
    }
    return false
  }

  /**
   * Triggers the Worms 3D ballistic leap into the locker.
   */
  launchItem(id: 'football' | 'sneaker' | 'whistle') {
    const item = this.items.get(id)
    if (!item || item.placed || item.flying) return

    item.flying = true
    item.flyProgress = 0
    item.startPos.copy(item.mesh.position)
  }

  update(delta: number, elapsedTime: number) {
    // ─── 1. FLYING & SQUASH/STRETCH ANIMATIONS ───
    this.items.forEach((item) => {
      if (item.flying) {
        item.flyProgress += delta * 1.8 // ~0.55s travel time
        const t = Math.min(item.flyProgress, 1.0)

        // Parabolic arc: lerp X and Z, quad parabola on Y
        const currentX = THREE.MathUtils.lerp(item.startPos.x, item.targetPos.x, t)
        const currentZ = THREE.MathUtils.lerp(item.startPos.z, item.targetPos.z, t)
        const arcY = Math.sin(t * Math.PI) * item.midArcHeight
        const currentY = THREE.MathUtils.lerp(item.startPos.y, item.targetPos.y, t) + arcY

        item.mesh.position.set(currentX, currentY, currentZ)

        // Worms 3D tumble in the air
        item.mesh.rotation.x += delta * 6
        item.mesh.rotation.y += delta * 8
        if (item.id === 'football') {
          item.mesh.rotation.z += delta * 7
        }

        // Stretching while in rapid flight
        const flightStretch = 1.0 + Math.sin(t * Math.PI) * 0.25
        item.mesh.scale.set(1 / Math.sqrt(flightStretch), flightStretch, 1 / Math.sqrt(flightStretch))

        // Landing impact event
        if (t >= 1.0) {
          item.flying = false
          item.placed = true
          item.squashTime = 0
          item.mesh.position.copy(item.targetPos)

          // Reset natural orientation
          if (item.id === 'football') {
            item.mesh.rotation.set(0.1, 0.4, 0)
          } else if (item.id === 'sneaker') {
            item.mesh.rotation.set(0, Math.PI * 0.15, 0)
          } else if (item.id === 'whistle') {
            item.mesh.rotation.set(0, 0, Math.PI * 0.04)
          }

          // Trigger celebratory burst & 3D floating banner
          this.triggerImpactCelebration(item)
        }
      } else if (item.placed) {
        // Elastic Squash & Stretch damping (spring equation)
        if (item.squashTime >= 0 && item.squashTime < 1.2) {
          item.squashTime += delta
          const springT = item.squashTime * 14
          // Damped oscillation: sin(t) * exp(-damping * t)
          const damping = Math.exp(-item.squashTime * 4.5)
          const deform = Math.sin(springT) * 0.45 * damping

          // Squash Y, stretch X/Z (volume conserving)
          const scaleY = 1.0 - deform
          const scaleXZ = 1.0 + deform * 0.5
          item.mesh.scale.set(scaleXZ, scaleY, scaleXZ)
        } else {
          // Settled idle micro-animation (alive breathing effect)
          const phase = elapsedTime * 2.5 + item.wobblePhase
          if (item.id === 'football') {
            // Subtle breathing and roll
            const idleBounce = Math.sin(phase) * 0.03
            item.mesh.position.y = item.targetPos.y + idleBounce
            item.mesh.rotation.y += delta * 0.4
          } else if (item.id === 'sneaker') {
            // Subtle energetic bounce
            const idleBounce = Math.abs(Math.sin(phase * 1.2)) * 0.04
            item.mesh.position.y = item.targetPos.y + idleBounce
          } else if (item.id === 'whistle') {
            // Pendulum swaying on the hook
            const sway = Math.sin(phase * 1.5) * 0.12
            item.mesh.rotation.z = sway
          }
        }
      } else {
        // Still in inventory (idle hovering before launch)
        const idleHover = Math.sin(elapsedTime * 3 + item.wobblePhase) * 0.05
        item.mesh.position.y = item.startPos.y + idleHover
        item.mesh.rotation.y += delta * 1.2
      }
    })

    // ─── 2. PARTICLES UPDATE ───
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life += delta
      if (p.life >= p.maxLife) {
        this.particleGroup.remove(p.mesh)
        p.mesh.geometry.dispose()
        ;(p.mesh.material as THREE.Material).dispose()
        this.particles.splice(i, 1)
        continue
      }

      // Physics movement
      p.mesh.position.addScaledVector(p.vel, delta)
      p.vel.y -= 7.0 * delta // gravity
      p.mesh.rotation.x += p.rotSpeed.x * delta
      p.mesh.rotation.y += p.rotSpeed.y * delta
      p.mesh.rotation.z += p.rotSpeed.z * delta

      // Fade out
      const progress = p.life / p.maxLife
      const mat = p.mesh.material as THREE.MeshBasicMaterial
      mat.opacity = 1.0 - progress
      const scale = (1.0 - progress * 0.5) * 0.14
      p.mesh.scale.set(scale, scale, scale)
    }

    // ─── 3. 3D BADGES UPDATE ───
    this.badges.forEach((badge, id) => {
      const item = this.items.get(id)
      if (item && item.placed) {
        // Gentle float above item
        const badgeHover = Math.sin(elapsedTime * 3 + item.wobblePhase) * 0.04
        badge.position.y = item.targetPos.y + (id === 'whistle' ? 1.05 : 0.85) + badgeHover
      }
    })
  }

  /**
   * Emits sparks, confeti and builds the floating 3D badge banner.
   */
  private triggerImpactCelebration(item: AnimatedItem) {
    const pos = item.targetPos
    const particleCount = 28

    const particleColors =
      item.id === 'football'
        ? [0x38bdf8, 0xfacc15, 0xffffff] // Golden & blue athletic stars
        : item.id === 'sneaker'
        ? [0x10b981, 0x34d399, 0xfef08a] // Energetic emerald sparks
        : [0xf43f5e, 0xfb7185, 0xffd1dc] // Warm pink & ruby heart motes

    for (let i = 0; i < particleCount; i++) {
      const geo =
        item.id === 'whistle'
          ? new THREE.TetrahedronGeometry(0.5)
          : new THREE.BoxGeometry(0.5, 0.5, 0.5)

      const col = particleColors[i % particleColors.length]
      const mat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 1.0,
      })
      const pMesh = new THREE.Mesh(geo, mat)
      pMesh.position.copy(pos)

      // Random spherical velocity burst
      const angle = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.6
      const speed = 2.5 + Math.random() * 3.5

      const vel = new THREE.Vector3(
        Math.cos(angle) * Math.sin(phi) * speed,
        Math.cos(phi) * speed + 2.0,
        Math.sin(angle) * Math.sin(phi) * speed
      )

      this.particleGroup.add(pMesh)
      this.particles.push({
        mesh: pMesh,
        vel,
        rotSpeed: new THREE.Vector3(
          Math.random() * 8,
          Math.random() * 8,
          Math.random() * 8
        ),
        life: 0,
        maxLife: 0.8 + Math.random() * 0.5,
      })
    }

    // Spawn 3D floating badge label
    this.createFloatingBadge(item)
  }

  private createFloatingBadge(item: AnimatedItem) {
    if (this.badges.has(item.id)) return

    const labelText =
      item.id === 'football'
        ? 'DIVERSIÓN ✨'
        : item.id === 'sneaker'
        ? 'ENERGÍA ⚡'
        : 'AMOR 💗'

    const bgCol =
      item.id === 'football'
        ? '#0284c7'
        : item.id === 'sneaker'
        ? '#059669'
        : '#e11d48'

    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 160
    const ctx = canvas.getContext('2d')!

    // Rounded badge background with glossy athletic rim
    ctx.fillStyle = bgCol
    ctx.beginPath()
    ctx.roundRect(16, 16, 480, 128, 64)
    ctx.fill()

    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 8
    ctx.stroke()

    // High-contrast clean typography
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 48px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(labelText, 256, 80)

    const tex = new THREE.CanvasTexture(canvas)
    const badgeGeo = new THREE.PlaneGeometry(1.2, 0.38)
    const badgeMat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
    })
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat)
    badgeMesh.position.set(item.targetPos.x, item.targetPos.y + 0.85, item.targetPos.z + 0.2)

    this.scene.add(badgeMesh)
    this.badges.set(item.id, badgeMesh)
  }

  reset() {
    this.badges.forEach((b) => {
      this.scene.remove(b)
      b.geometry.dispose()
      ;(b.material as THREE.Material).dispose()
    })
    this.badges.clear()

    this.particles.forEach((p) => {
      this.particleGroup.remove(p.mesh)
      p.mesh.geometry.dispose()
      ;(p.mesh.material as THREE.Material).dispose()
    })
    this.particles = []

    this.items.forEach((item) => {
      item.placed = false
      item.flying = false
      item.flyProgress = 0
      item.squashTime = -1
      item.mesh.position.copy(item.startPos)
      item.mesh.scale.set(0.9, 0.9, 0.9)
    })
  }

  dispose() {
    this.reset()
    this.scene.remove(this.particleGroup)
  }
}
