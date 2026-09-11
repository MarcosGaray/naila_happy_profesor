import * as THREE from 'three'
import { createSoccerBall } from './models/SoccerBall'
import { createJordanShoe } from './models/JordanShoe'
import { createHeartWhistle } from './models/HeartWhistle'
import { createLockerEnvironment } from './models/LockerEnvironment'
import { WormsPhysicsSystem } from './systems/WormsPhysics'

export interface LockerSceneCallbacks {
  onItemPlaced?: (id: 'football' | 'sneaker' | 'whistle') => void
  onAllPlaced?: () => void
}

/**
 * Master controller for the 3D Locker Room Experience.
 * Encapsulates Three.js rendering, lighting, camera parallax,
 * and Worms 3D physical interactions.
 */
export class LockerScene {
  public container: HTMLElement
  public renderer: THREE.WebGLRenderer
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera
  public physics: WormsPhysicsSystem

  private animationFrameId: number | null = null
  private clock: THREE.Clock = new THREE.Clock()
  private callbacks: LockerSceneCallbacks

  // Meshes
  public soccerBall: THREE.Group
  public jordanShoe: THREE.Group
  public heartWhistle: THREE.Group

  // Interactive camera parallax
  private targetCameraPos: THREE.Vector3 = new THREE.Vector3(0, 0.4, 4.2)
  private currentCameraPos: THREE.Vector3 = new THREE.Vector3(0, 0.4, 4.2)
  private lookAtTarget: THREE.Vector3 = new THREE.Vector3(0, 0, -1.6)

  // Raycasting for direct 3D clicks
  private raycaster: THREE.Raycaster = new THREE.Raycaster()
  private pointer: THREE.Vector2 = new THREE.Vector2()

  private placedState = {
    football: false,
    sneaker: false,
    whistle: false,
  }

  constructor(container: HTMLElement, callbacks: LockerSceneCallbacks = {}) {
    this.container = container
    this.callbacks = callbacks

    // 1. Scene setup
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xf1f5f9)

    // 2. Camera setup
    const aspect = container.clientWidth / container.clientHeight
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 50)
    this.camera.position.copy(this.currentCameraPos)
    this.camera.lookAt(this.lookAtTarget)

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.15
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(this.renderer.domElement)

    // 4. Physics system
    this.physics = new WormsPhysicsSystem(this.scene)

    // 5. Environment & Locker
    const env = createLockerEnvironment()
    this.scene.add(env.group)

    // 6. 3D Models
    this.soccerBall = createSoccerBall()
    this.jordanShoe = createJordanShoe()
    this.heartWhistle = createHeartWhistle()

    this.scene.add(this.soccerBall)
    this.scene.add(this.jordanShoe)
    this.scene.add(this.heartWhistle)

    // Initial resting positions (in front staging / bottom shelf)
    const startPos = {
      football: new THREE.Vector3(-1.4, -1.8, 1.4),
      sneaker: new THREE.Vector3(0, -1.85, 1.4),
      whistle: new THREE.Vector3(1.4, -1.8, 1.4),
    }

    this.physics.registerItem('football', this.soccerBall, env.targetPositions.football, startPos.football)
    this.physics.registerItem('sneaker', this.jordanShoe, env.targetPositions.sneaker, startPos.sneaker)
    this.physics.registerItem('whistle', this.heartWhistle, env.targetPositions.whistle, startPos.whistle)

    // Adjust camera for mobile viewports (e.g. iPhone 13 390x844)
    this.handleInitialCamera(aspect)

    // Events
    this.initEvents()

    // Start render loop
    this.animate()
  }

  private handleInitialCamera(aspect: number) {
    if (aspect < 0.6) {
      // Mobile portrait view (iPhone 13: 390x844, aspect ~0.462)
      // Uses a balanced vertical FOV and moves back on Z so the full 3-bay locker and props fit perfectly
      this.camera.fov = 56
      const zDist = Math.max(9.6, 4.4 / aspect)
      this.targetCameraPos.set(0, 0.4, zDist)
      this.currentCameraPos.copy(this.targetCameraPos)
      this.lookAtTarget.set(0, 0.05, -1.8)
    } else if (aspect < 1.0) {
      // Tablet portrait
      this.camera.fov = 50
      const zDist = Math.max(7.6, 3.8 / aspect)
      this.targetCameraPos.set(0, 0.35, zDist)
      this.currentCameraPos.copy(this.targetCameraPos)
      this.lookAtTarget.set(0, 0.0, -1.8)
    } else {
      // Desktop landscape view
      this.camera.fov = 45
      this.targetCameraPos.set(0, 0.4, 4.4)
      this.currentCameraPos.copy(this.targetCameraPos)
      this.lookAtTarget.set(0, -0.1, -1.6)
    }
    this.camera.updateProjectionMatrix()
    this.camera.position.copy(this.currentCameraPos)
    this.camera.lookAt(this.lookAtTarget)
  }

  private initEvents() {
    window.addEventListener('resize', this.onResize)
    this.container.addEventListener('pointermove', this.onPointerMove)
    this.container.addEventListener('pointerdown', this.onPointerDown)
  }

  public onResize = () => {
    if (!this.container) return
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    const aspect = width / height
    this.camera.aspect = aspect
    this.handleInitialCamera(aspect)
    this.renderer.setSize(width, height)
  }

  public onPointerMove = (e: MouseEvent | PointerEvent) => {
    const rect = this.container.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

    this.pointer.x = x
    this.pointer.y = y

    // Responsive camera parallax
    const aspect = rect.width / rect.height
    const isMobile = aspect < 0.6
    const maxOffsetX = isMobile ? 1.4 : 0.6
    const maxOffsetY = isMobile ? 0.6 : 0.3
    const baseZ = isMobile ? Math.max(9.6, 4.4 / aspect) : 4.4
    const baseY = isMobile ? 0.4 : 0.4

    this.targetCameraPos.x = x * maxOffsetX
    this.targetCameraPos.y = baseY + y * maxOffsetY
    this.targetCameraPos.z = baseZ
  }

  private onPointerDown = (e: PointerEvent) => {
    const rect = this.container.getBoundingClientRect()
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

    this.raycaster.setFromCamera(this.pointer, this.camera)

    // Check clicks on the 3 items
    const checkIntersection = (group: THREE.Group, id: 'football' | 'sneaker' | 'whistle') => {
      if (this.placedState[id]) return false
      const intersects = this.raycaster.intersectObjects(group.children, true)
      if (intersects.length > 0) {
        this.placeItem(id)
        return true
      }
      return false
    }

    if (checkIntersection(this.soccerBall, 'football')) return
    if (checkIntersection(this.jordanShoe, 'sneaker')) return
    if (checkIntersection(this.heartWhistle, 'whistle')) return
  }

  /**
   * Places an item into the locker with Worms 3D physics.
   */
  public placeItem(id: 'football' | 'sneaker' | 'whistle') {
    if (this.placedState[id]) return

    this.placedState[id] = true
    this.physics.launchItem(id)

    if (this.callbacks.onItemPlaced) {
      this.callbacks.onItemPlaced(id)
    }

    // Check if all are placed
    const all = this.placedState.football && this.placedState.sneaker && this.placedState.whistle
    if (all) {
      setTimeout(() => {
        this.zoomToClimax()
        if (this.callbacks.onAllPlaced) {
          this.callbacks.onAllPlaced()
        }
      }, 900)
    }
  }

  public zoomToClimax() {
    // Cinematic camera focus on the completed locker
    const aspect = this.container.clientWidth / this.container.clientHeight
    if (aspect < 0.6) {
      this.targetCameraPos.set(0, 0.4, 7.8)
      this.lookAtTarget.set(0, 0.1, -1.8)
    } else if (aspect < 1.0) {
      this.targetCameraPos.set(0, 0.35, 6.2)
      this.lookAtTarget.set(0, 0.1, -1.8)
    } else {
      this.targetCameraPos.set(0, 0.2, 3.6)
      this.lookAtTarget.set(0, 0.1, -1.6)
    }
  }

  public reset() {
    this.placedState = {
      football: false,
      sneaker: false,
      whistle: false,
    }
    this.physics.reset()
    const aspect = this.container.clientWidth / this.container.clientHeight
    this.handleInitialCamera(aspect)
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate)

    const delta = Math.min(this.clock.getDelta(), 0.1)
    const elapsed = this.clock.getElapsedTime()

    // Smooth camera lerp (Parallax)
    this.currentCameraPos.lerp(this.targetCameraPos, delta * 4)
    this.camera.position.copy(this.currentCameraPos)
    this.camera.lookAt(this.lookAtTarget)

    // Update Worms 3D physics & particles
    this.physics.update(delta, elapsed)

    // Render frame
    this.renderer.render(this.scene, this.camera)
  }

  public dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
    }
    window.removeEventListener('resize', this.onResize)
    this.container.removeEventListener('pointermove', this.onPointerMove)
    this.container.removeEventListener('pointerdown', this.onPointerDown)

    this.physics.dispose()

    this.renderer.dispose()
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }
  }
}
