import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  stage: number;
  isTransitioning: boolean;
  boxOpened: boolean;
  onObjectClick?: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  stage,
  isTransitioning,
  boxOpened,
  onObjectClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    stageGroups: THREE.Group[];
    dustParticles: THREE.Points;
    dustOriginalPos: Float32Array;
    dustVelocities: Float32Array;
    celestialParticles: THREE.Points;
    portalParticles: THREE.Points;
    discoBall?: THREE.Mesh;
    boxTop?: THREE.Mesh;
    boxBottom?: THREE.Mesh;
    boxCore?: THREE.Mesh;
    lockRing?: THREE.Mesh;
    tesseractInner?: THREE.Mesh;
    tesseractOuter?: THREE.Mesh;
    quantumRings?: THREE.Mesh[];
    stargateGears?: THREE.Mesh[];
    celestialLotus?: THREE.Group;
    monoliths?: THREE.Mesh[];
    memeObject?: THREE.Group;
    targetCamPos: THREE.Vector3;
    targetCamLook: THREE.Vector3;
    currentCamLook: THREE.Vector3;
    mouse: THREE.Vector2;
    mouseRayPos: THREE.Vector3;
    discoLights: THREE.PointLight[];
    partyMascot?: THREE.Group;
    floatingEmojis?: THREE.Group;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040409, 0.032);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Multi-spectrum Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0x18182b, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff0077, 2.2);
    rimLight.position.set(-6, -4, -3);
    scene.add(rimLight);

    // 3. Stage Groups
    const stageGroups: THREE.Group[] = [
      new THREE.Group(), // Stage 1: Quantum Bio-Core Artifact
      new THREE.Group(), // Stage 2: Mechanical Ancient Cyber-Vault
      new THREE.Group(), // Stage 3: Monolith Cyber Matrix & Neon Meme
      new THREE.Group(), // Stage 4: Giant Stargate Portal with Rotating Gears
      new THREE.Group(), // Stage 5: Floating Sacred Golden Lotus Realm
      new THREE.Group(), // Stage 6: Disco & Party Mascot Realm
    ];
    stageGroups.forEach((g) => scene.add(g));

    // ==========================================
    // STAGE 1: Quantum Bio-Core with Gyroscopic Rings
    // ==========================================
    const s1Group = stageGroups[0];
    const outerGeo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      wireframe: true,
      emissive: 0x004466,
      roughness: 0.1,
      metalness: 0.9,
    });
    const tesseractOuter = new THREE.Mesh(outerGeo, outerMat);
    s1Group.add(tesseractOuter);

    const innerGeo = new THREE.OctahedronGeometry(1.2, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x9900ff,
      emissive: 0x6600cc,
      roughness: 0.2,
      metalness: 0.8,
    });
    const tesseractInner = new THREE.Mesh(innerGeo, innerMat);
    s1Group.add(tesseractInner);

    const quantumRings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(1.9 + i * 0.35, 0.03, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0x00f0ff : i === 1 ? 0xff00aa : 0x7928ca,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI * (i / 3);
      ring.rotation.y = Math.PI * (i / 4);
      s1Group.add(ring);
      quantumRings.push(ring);
    }

    // ==========================================
    // STAGE 2: Mechanical Ancient Cyber-Vault
    // ==========================================
    const s2Group = stageGroups[1];
    s2Group.position.set(0, 0, -20);

    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x0f0c1d,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x1f0b3d,
    });
    const boxGoldTrim = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      metalness: 1.0,
      roughness: 0.2,
      emissive: 0x442200,
    });

    const topGeo = new THREE.CylinderGeometry(1.6, 1.8, 1.0, 8);
    const boxTop = new THREE.Mesh(topGeo, boxMat);
    boxTop.position.y = 0.55;
    s2Group.add(boxTop);

    const bottomGeo = new THREE.CylinderGeometry(1.8, 1.6, 1.0, 8);
    const boxBottom = new THREE.Mesh(bottomGeo, boxMat);
    boxBottom.position.y = -0.55;
    s2Group.add(boxBottom);

    const lockGeo = new THREE.TorusGeometry(1.85, 0.1, 16, 32);
    const lockRing = new THREE.Mesh(lockGeo, boxGoldTrim);
    lockRing.rotation.x = Math.PI / 2;
    s2Group.add(lockRing);

    const coreGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff00aa,
      emissive: 0xff0055,
      roughness: 0.1,
    });
    const boxCore = new THREE.Mesh(coreGeo, coreMat);
    s2Group.add(boxCore);

    for (let r = 0; r < 6; r++) {
      const runeGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2);
      const runeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const rune = new THREE.Mesh(runeGeo, runeMat);
      const angle = (r / 6) * Math.PI * 2;
      rune.position.set(Math.cos(angle) * 2.3, 0, Math.sin(angle) * 2.3);
      rune.rotation.y = angle;
      s2Group.add(rune);
    }

    // ==========================================
    // STAGE 3: Monolith Cyber Matrix & Neon Meme
    // ==========================================
    const s3Group = stageGroups[2];
    s3Group.position.set(0, 0, -40);

    const monoliths: THREE.Mesh[] = [];
    const monoGeo = new THREE.BoxGeometry(0.6, 6, 0.6);
    const monoMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a1f,
      roughness: 0.1,
      metalness: 0.95,
      emissive: 0x221155,
    });

    for (let i = 0; i < 8; i++) {
      const m = new THREE.Mesh(monoGeo, monoMat);
      const angle = (i / 8) * Math.PI * 2;
      m.position.set(Math.cos(angle) * 4.5, (Math.random() - 0.5) * 1.5, Math.sin(angle) * 4.5);
      s3Group.add(m);
      monoliths.push(m);
    }

    const memeObject = new THREE.Group();
    const qArcGeo = new THREE.TorusGeometry(0.7, 0.18, 16, 32, Math.PI * 1.5);
    const goldShinyMat = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x664400,
    });
    const qArc = new THREE.Mesh(qArcGeo, goldShinyMat);
    qArc.position.y = 0.5;
    memeObject.add(qArc);

    const qDotGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const qDot = new THREE.Mesh(qDotGeo, goldShinyMat);
    qDot.position.y = -0.7;
    memeObject.add(qDot);
    s3Group.add(memeObject);

    // ==========================================
    // STAGE 4: Epic Stargate with Dual Gears
    // ==========================================
    const s4Group = stageGroups[3];
    s4Group.position.set(0, 0, -60);

    const portalTorusGeo = new THREE.TorusGeometry(3.6, 0.35, 24, 120);
    const portalTorusMat = new THREE.MeshStandardMaterial({
      color: 0x110022,
      emissive: 0x8800ff,
      metalness: 0.9,
      roughness: 0.2,
    });
    const portalRing = new THREE.Mesh(portalTorusGeo, portalTorusMat);
    s4Group.add(portalRing);

    const stargateGears: THREE.Mesh[] = [];
    const gearGeo = new THREE.TorusGeometry(4.2, 0.15, 12, 60);
    const gearMat = new THREE.MeshStandardMaterial({
      color: 0xff0055,
      emissive: 0x660022,
      wireframe: true,
    });
    const gearRing = new THREE.Mesh(gearGeo, gearMat);
    s4Group.add(gearRing);
    stargateGears.push(gearRing);

    const horizonGeo = new THREE.CircleGeometry(3.4, 64);
    const horizonMat = new THREE.MeshBasicMaterial({
      color: 0x030008,
      side: THREE.DoubleSide,
    });
    const horizonDisk = new THREE.Mesh(horizonGeo, horizonMat);
    s4Group.add(horizonDisk);

    const portalPCount = 1200;
    const portalPGeo = new THREE.BufferGeometry();
    const portalPPos = new Float32Array(portalPCount * 3);
    const portalPColors = new Float32Array(portalPCount * 3);

    for (let i = 0; i < portalPCount; i++) {
      const radius = 0.5 + Math.random() * 3.0;
      const angle = Math.random() * Math.PI * 2;
      portalPPos[i * 3] = Math.cos(angle) * radius;
      portalPPos[i * 3 + 1] = Math.sin(angle) * radius;
      portalPPos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      portalPColors[i * 3] = 0.8 + Math.random() * 0.2;
      portalPColors[i * 3 + 1] = 0.1 + Math.random() * 0.5;
      portalPColors[i * 3 + 2] = 1.0;
    }
    portalPGeo.setAttribute('position', new THREE.BufferAttribute(portalPPos, 3));
    portalPGeo.setAttribute('color', new THREE.BufferAttribute(portalPColors, 3));
    const portalPMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const portalParticles = new THREE.Points(portalPGeo, portalPMat);
    s4Group.add(portalParticles);

    // ==========================================
    // STAGE 5: Sacred Heavenly Golden Lotus Realm
    // ==========================================
    const s5Group = stageGroups[4];
    s5Group.position.set(0, 0, -80);

    const celestialLotus = new THREE.Group();

    const crystalGeo = new THREE.OctahedronGeometry(2.2, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      reflectivity: 0.9,
      emissive: 0xffe680,
      emissiveIntensity: 0.45,
    });
    const celestialCrystal = new THREE.Mesh(crystalGeo, crystalMat);
    celestialLotus.add(celestialCrystal);

    for (let p = 0; p < 8; p++) {
      const petalGeo = new THREE.ConeGeometry(0.5, 2.0, 4);
      const petalMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0x664400,
        roughness: 0.2,
        metalness: 0.9,
      });
      const petal = new THREE.Mesh(petalGeo, petalMat);
      const angle = (p / 8) * Math.PI * 2;
      petal.position.set(Math.cos(angle) * 1.8, -0.6, Math.sin(angle) * 1.8);
      petal.rotation.x = Math.PI / 4;
      petal.rotation.y = angle;
      celestialLotus.add(petal);
    }

    for (let i = 0; i < 2; i++) {
      const haloGeo = new THREE.RingGeometry(3.0 + i * 0.8, 3.1 + i * 0.8, 64);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6 - i * 0.2,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2.3;
      celestialLotus.add(halo);
    }
    s5Group.add(celestialLotus);

    const celPCount = 900;
    const celPGeo = new THREE.BufferGeometry();
    const celPPos = new Float32Array(celPCount * 3);
    for (let i = 0; i < celPCount; i++) {
      celPPos[i * 3] = (Math.random() - 0.5) * 15;
      celPPos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      celPPos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    celPGeo.setAttribute('position', new THREE.BufferAttribute(celPPos, 3));
    const celPMat = new THREE.PointsMaterial({
      color: 0xffea79,
      size: 0.09,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const celestialParticles = new THREE.Points(celPGeo, celPMat);
    s5Group.add(celestialParticles);

    // ==========================================
    // STAGE 6: The Ultimate Funny Celebration Realm
    // ==========================================
    const s6Group = stageGroups[5];
    s6Group.position.set(0, 0, -100);

    const discoGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const discoMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.05,
      flatShading: true,
    });
    const discoBall = new THREE.Mesh(discoGeo, discoMat);
    discoBall.position.set(0, 2.5, 0);
    s6Group.add(discoBall);

    const discoLights: THREE.PointLight[] = [];
    const colors = [0xff0055, 0x00ffcc, 0xffff00, 0x9900ff];
    colors.forEach((col, idx) => {
      const pl = new THREE.PointLight(col, 2.5, 15);
      const ang = (idx / 4) * Math.PI * 2;
      pl.position.set(Math.cos(ang) * 4, 3, Math.sin(ang) * 4);
      s6Group.add(pl);
      discoLights.push(pl);
    });

    const partyMascot = new THREE.Group();
    partyMascot.position.set(0, -1.2, 0);

    const bodyGeo = new THREE.DodecahedronGeometry(1.0, 1);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xff3366,
      metalness: 0.5,
      roughness: 0.3,
    });
    const mascotBody = new THREE.Mesh(bodyGeo, bodyMat);
    partyMascot.add(mascotBody);

    const hatGeo = new THREE.ConeGeometry(0.4, 0.9, 16);
    const hatMat = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      metalness: 0.3,
      roughness: 0.2,
      emissive: 0x553300,
    });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.set(0, 1.25, 0);
    hat.rotation.z = -0.15;
    partyMascot.add(hat);

    const glassGeo = new THREE.BoxGeometry(0.9, 0.25, 0.2);
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const glasses = new THREE.Mesh(glassGeo, glassMat);
    glasses.position.set(0, 0.3, 0.95);
    partyMascot.add(glasses);

    const chainGeo = new THREE.TorusGeometry(0.7, 0.08, 8, 24);
    const chainMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1,
    });
    const chain = new THREE.Mesh(chainGeo, chainMat);
    chain.position.set(0, -0.4, 0.4);
    chain.rotation.x = Math.PI / 3;
    partyMascot.add(chain);
    s6Group.add(partyMascot);

    const floatingEmojis = new THREE.Group();
    for (let e = 0; e < 16; e++) {
      const emojiGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const emojiMat = new THREE.MeshBasicMaterial({
        color: e % 2 === 0 ? 0xffcc00 : 0x00ffff,
        wireframe: true,
      });
      const boxEmoji = new THREE.Mesh(emojiGeo, emojiMat);
      boxEmoji.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
      floatingEmojis.add(boxEmoji);
    }
    s6Group.add(floatingEmojis);

    // ==========================================
    // Interactive Ambient Particle Field (Reacts to Cursor)
    // ==========================================
    const dustCount = 2200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustOriginalPos = new Float32Array(dustCount * 3);
    const dustVelocities = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const x = (Math.random() - 0.5) * 36;
      const y = (Math.random() - 0.5) * 26;
      const z = -Math.random() * 110 + 10;

      dustPos[i * 3] = x;
      dustPos[i * 3 + 1] = y;
      dustPos[i * 3 + 2] = z;

      dustOriginalPos[i * 3] = x;
      dustOriginalPos[i * 3 + 1] = y;
      dustOriginalPos[i * 3 + 2] = z;

      // Color variation: Cyan, Violet, Amber, Electric Blue
      const colorType = Math.random();
      if (colorType < 0.35) {
        dustColors[i * 3] = 0.0;
        dustColors[i * 3 + 1] = 0.9;
        dustColors[i * 3 + 2] = 1.0; // Cyan
      } else if (colorType < 0.7) {
        dustColors[i * 3] = 0.6;
        dustColors[i * 3 + 1] = 0.2;
        dustColors[i * 3 + 2] = 1.0; // Violet
      } else {
        dustColors[i * 3] = 1.0;
        dustColors[i * 3 + 1] = 0.75;
        dustColors[i * 3 + 2] = 0.2; // Amber gold
      }
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    stateRef.current = {
      scene,
      camera,
      renderer,
      stageGroups,
      dustParticles,
      dustOriginalPos,
      dustVelocities,
      celestialParticles,
      portalParticles,
      discoBall,
      boxTop,
      boxBottom,
      boxCore,
      lockRing,
      tesseractInner,
      tesseractOuter,
      quantumRings,
      stargateGears,
      celestialLotus,
      monoliths,
      memeObject,
      targetCamPos: new THREE.Vector3(0, 0, 8),
      targetCamLook: new THREE.Vector3(0, 0, 0),
      currentCamLook: new THREE.Vector3(0, 0, 0),
      mouse: new THREE.Vector2(0, 0),
      mouseRayPos: new THREE.Vector3(0, 0, 0),
      discoLights,
      partyMascot,
      floatingEmojis,
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!stateRef.current) return;
      stateRef.current.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      stateRef.current.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      if (!stateRef.current) return;
      const { camera, renderer } = stateRef.current;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const onClick = () => {
      onObjectClick?.();
    };
    container.addEventListener('click', onClick);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      const state = stateRef.current;
      if (!state) return;

      const {
        camera,
        renderer,
        scene,
        targetCamPos,
        targetCamLook,
        currentCamLook,
        mouse,
        dustParticles,
        dustOriginalPos,
        tesseractInner,
        tesseractOuter,
        quantumRings,
        stargateGears,
        celestialLotus,
        portalParticles,
        celestialParticles,
        discoBall,
        discoLights,
        partyMascot,
        floatingEmojis,
        memeObject,
        monoliths,
      } = state;

      // Mouse Parallax easing
      const targetX = targetCamPos.x + mouse.x * 0.8;
      const targetY = targetCamPos.y + mouse.y * 0.5;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.position.z += (targetCamPos.z - camera.position.z) * 0.05;

      currentCamLook.lerp(targetCamLook, 0.05);
      camera.lookAt(currentCamLook);

      // ====================================================
      // Interactive Particles: React to Cursor in 3D Space
      // ====================================================
      if (dustParticles) {
        const positions = dustParticles.geometry.attributes.position.array as Float32Array;
        // Project 2D mouse coordinates into an approximate 3D world plane in front of the camera
        const cursorWorldX = camera.position.x + mouse.x * 5.5;
        const cursorWorldY = camera.position.y + mouse.y * 4.0;
        const cursorWorldZ = camera.position.z - 7.0;

        for (let i = 0; i < dustCount; i++) {
          const idx = i * 3;
          let px = positions[idx];
          let py = positions[idx + 1];
          let pz = positions[idx + 2];

          const origX = dustOriginalPos[idx];
          const origY = dustOriginalPos[idx + 1];
          const origZ = dustOriginalPos[idx + 2];

          // Calculate distance to cursor
          const dx = px - cursorWorldX;
          const dy = py - cursorWorldY;
          const dz = pz - cursorWorldZ;
          const distSq = dx * dx + dy * dy + dz * dz;

          // Repulsion sphere around mouse cursor
          if (distSq < 16.0 && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (4.0 - dist) / 4.0; // Stronger closer to center
            const push = force * 0.18;
            px += (dx / dist) * push;
            py += (dy / dist) * push;
            pz += (dz / dist) * push;
          }

          // Ambient cosmic floating drift + gentle return to original anchor
          const floatOffset = Math.sin(time * 0.8 + i) * 0.008;
          px += (origX - px) * 0.025;
          py += (origY - py) * 0.025 + floatOffset;
          pz += (origZ - pz) * 0.025;

          positions[idx] = px;
          positions[idx + 1] = py;
          positions[idx + 2] = pz;
        }
        dustParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Stage 1 animation
      if (tesseractInner && tesseractOuter) {
        tesseractOuter.rotation.x += delta * 0.4;
        tesseractOuter.rotation.y += delta * 0.5;
        tesseractInner.rotation.x -= delta * 0.6;
        tesseractInner.rotation.y -= delta * 0.8;
        tesseractInner.scale.setScalar(1 + Math.sin(time * 3) * 0.08);
      }
      if (quantumRings) {
        quantumRings.forEach((qr, i) => {
          qr.rotation.z += delta * (0.8 + i * 0.3);
          qr.rotation.x += delta * 0.2;
        });
      }

      // Stage 2 Box animation
      if (state.lockRing && state.boxTop && state.boxBottom && state.boxCore) {
        if (boxOpened) {
          state.boxTop.position.y = THREE.MathUtils.lerp(state.boxTop.position.y, 2.2, 0.06);
          state.boxBottom.position.y = THREE.MathUtils.lerp(state.boxBottom.position.y, -2.2, 0.06);
          state.lockRing.scale.setScalar(THREE.MathUtils.lerp(state.lockRing.scale.x, 2.4, 0.05));
          state.boxCore.rotation.y += delta * 3;
          state.boxCore.scale.setScalar(1.2 + Math.sin(time * 6) * 0.2);
        } else {
          state.lockRing.rotation.z += delta * 0.8;
        }
      }

      // Stage 3 animation
      if (memeObject) {
        memeObject.rotation.y = Math.sin(time * 2) * 0.4;
        memeObject.position.y = Math.sin(time * 3) * 0.25;
      }
      if (monoliths) {
        monoliths.forEach((m, idx) => {
          m.rotation.y += delta * 0.2 * (idx % 2 === 0 ? 1 : -1);
          m.position.y += Math.sin(time * 2 + idx) * 0.005;
        });
      }

      // Stage 4 Stargate Gears
      if (stargateGears && stargateGears[0]) {
        stargateGears[0].rotation.z -= delta * 0.6;
      }
      if (portalParticles) {
        portalParticles.rotation.z += delta * 0.9;
        const positions = portalParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 2] += Math.sin(time * 4 + i) * 0.003;
        }
        portalParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Stage 5 Celestial Lotus animation
      if (celestialLotus) {
        celestialLotus.rotation.y += delta * 0.4;
        celestialLotus.position.y = Math.sin(time * 1.5) * 0.15;
      }
      if (celestialParticles) {
        celestialParticles.rotation.y += delta * 0.1;
      }

      // Stage 6 Celebration animation
      if (discoBall) {
        discoBall.rotation.y += delta * 1.5;
      }
      if (discoLights && discoLights.length > 0) {
        discoLights.forEach((pl, i) => {
          const angle = time * 2 + (i / 4) * Math.PI * 2;
          pl.position.x = Math.cos(angle) * 5;
          pl.position.z = Math.sin(angle) * 5 - 100;
        });
      }
      if (partyMascot) {
        partyMascot.position.y = -1.2 + Math.abs(Math.sin(time * 6)) * 0.5;
        partyMascot.rotation.y = Math.sin(time * 5) * 0.4;
        partyMascot.rotation.z = Math.cos(time * 6) * 0.15;
      }
      if (floatingEmojis) {
        floatingEmojis.children.forEach((child, idx) => {
          child.rotation.x += delta * (idx % 2 === 0 ? 1 : -1);
          child.rotation.y += delta * 1.2;
          child.position.y += Math.sin(time * 2 + idx) * 0.01;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('click', onClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!stateRef.current) return;
    const { targetCamPos, targetCamLook } = stateRef.current;

    switch (stage) {
      case 1:
        targetCamPos.set(0, 0, 7);
        targetCamLook.set(0, 0, 0);
        break;
      case 2:
        targetCamPos.set(0, 0.2, -14);
        targetCamLook.set(0, 0, -20);
        break;
      case 3:
        targetCamPos.set(0, 0.5, -33);
        targetCamLook.set(0, 0, -40);
        break;
      case 4:
        targetCamPos.set(0, 0, -52);
        targetCamLook.set(0, 0, -60);
        break;
      case 5:
        targetCamPos.set(0, 0, -72);
        targetCamLook.set(0, 0, -80);
        break;
      case 6:
        targetCamPos.set(0, 0.5, -93);
        targetCamLook.set(0, 0, -100);
        break;
      default:
        targetCamPos.set(0, 0, 7);
        targetCamLook.set(0, 0, 0);
    }
  }, [stage]);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-auto transition-filter duration-700 ${
        isTransitioning ? 'blur-[3px] scale-[1.02]' : 'blur-0 scale-100'
      }`}
      style={{ zIndex: 0 }}
    />
  );
};
