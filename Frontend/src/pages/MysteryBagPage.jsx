import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import logoImg from '../assets/alibaba-logo.png.png';
import { getAllProducts } from '../services/productService';
import { getRollCredits, useRollCredit, addRollCredits } from '../services/rollCreditsService';

const MysteryBagScene = ({ onBagClick, isBusy, sceneRef, bagsRef, setBagsRef, foodItems, boxCount }) => {
  const [hoveredBag, setHoveredBag] = useState(null);
  const boxColors = [
    '#006d36', // Xanh lá đậm
    '#4ade80', // Xanh lá nhạt
    '#00bcd4', // Xanh cyan
    '#2196f3', // Xanh dương
    '#3f51b5', // Xanh tím
    '#9c27b0', // Tím
    '#e91e63', // Hồng đỏ
    '#f44336', // Đỏ
    '#ff9800', // Cam
    '#ffc107', // Vàng
    '#ffeb3b', // Vàng nhạt
    '#8bc34a', // Xanh olive
    '#009688', // Xanh teal
    '#673ab7', // Tím đậm
    '#ff5722', // Đỏ cam
  ];

  useEffect(() => {
    if (!sceneRef.current) return;

    // Load logo texture from image
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load(logoImg);
    logoTexture.wrapS = THREE.RepeatWrapping;
    logoTexture.wrapT = THREE.RepeatWrapping;

    // Create retail box with lid - màu trắng
    const premiumBoxMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.5,
      emissive: 0xffffff,
      emissiveIntensity: 0.05
    });

    const boxLogoMaterial = new THREE.MeshStandardMaterial({ 
      map: logoTexture, 
      transparent: true,
      roughness: 0.1,
      metalness: 0.5
    });

    const boxWidth = 14;
    const boxDepth = 14;
    const boxHeight = 5;
    const wallThickness = 0.5;

    const boxGroup = new THREE.Group();
    
    const bottomGeo = new THREE.BoxGeometry(boxWidth, wallThickness, boxDepth);
    const bottom = new THREE.Mesh(bottomGeo, premiumBoxMaterial);
    bottom.position.y = -wallThickness/2;
    bottom.receiveShadow = true;
    boxGroup.add(bottom);

    const sideWallsGeo = new THREE.BoxGeometry(boxWidth, boxHeight, wallThickness);
    const backWall = new THREE.Mesh(sideWallsGeo, premiumBoxMaterial);
    backWall.position.set(0, boxHeight/2, -boxDepth/2 + wallThickness/2);
    backWall.castShadow = true;
    boxGroup.add(backWall);

    const sideWallVerticalGeo = new THREE.BoxGeometry(wallThickness, boxHeight, boxDepth);
    const leftWall = new THREE.Mesh(sideWallVerticalGeo, premiumBoxMaterial);
    leftWall.position.set(-boxWidth/2 + wallThickness/2, boxHeight/2, 0);
    leftWall.castShadow = true;
    boxGroup.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallVerticalGeo, premiumBoxMaterial);
    rightWall.position.set(boxWidth/2 - wallThickness/2, boxHeight/2, 0);
    rightWall.castShadow = true;
    boxGroup.add(rightWall);

    const frontWallGeo = new THREE.BoxGeometry(boxWidth, boxHeight/2, wallThickness);
    const frontWall = new THREE.Mesh(frontWallGeo, premiumBoxMaterial);
    frontWall.position.set(0, boxHeight/4, boxDepth/2 - wallThickness/2);
    frontWall.castShadow = true;
    boxGroup.add(frontWall);

    const logoPlaneGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const logoOnBoxFront = new THREE.Mesh(logoPlaneGeo, boxLogoMaterial);
    logoOnBoxFront.position.set(0, boxHeight/4, boxDepth/2 - wallThickness/2 + 0.26);
    boxGroup.add(logoOnBoxFront);

    const lidGeo = new THREE.BoxGeometry(boxWidth, wallThickness, boxDepth);
    const lid = new THREE.Mesh(lidGeo, premiumBoxMaterial);
    lid.rotation.x = Math.PI / 2 - 0.08; 
    lid.position.set(0, boxHeight + boxDepth/2 - 1.5, -boxDepth/2 - wallThickness);
    lid.castShadow = true;
    boxGroup.add(lid);

    const logoOnLid = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 7.5), boxLogoMaterial);
    logoOnLid.position.set(0, boxHeight + boxDepth/2 - 1.5, -boxDepth/2 - wallThickness + 0.3);
    logoOnLid.rotation.x = -0.08;
    boxGroup.add(logoOnLid);

    boxGroup.position.y = -4.5;
    sceneRef.current.add(boxGroup);

    // Create gift boxes inside the display box
    const gridSpacing = 3.8;
    let boxIndex = 0;

    // Random number of boxes from 1 to 9
    const numBoxes = boxCount || Math.floor(Math.random() * 9) + 1;
    
    // Shuffle food items and take first numBoxes
    const shuffledFood = [...foodItems].sort(() => 0.5 - Math.random()).slice(0, numBoxes);

    for (let i = 0; i < numBoxes; i++) {
      // Calculate position in grid
      const row = Math.floor(i / 3);
      const col = i % 3;
      const x = (col - 1) * gridSpacing;
      const z = (row - 1) * gridSpacing;
      const color = boxColors[i];

      // Create gift box (cube with lid)
      const giftBoxGroup = new THREE.Group();
      
      // Box body
      const boxBodyGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
      const boxMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 });
      const boxBody = new THREE.Mesh(boxBodyGeo, boxMat);
      giftBoxGroup.add(boxBody);

      // Box lid
      const lidGeo = new THREE.BoxGeometry(2.6, 0.3, 2.6);
      const lidMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.5 });
      const lid = new THREE.Mesh(lidGeo, lidMat);
      lid.position.y = 1.4;
      giftBoxGroup.add(lid);

      // Ribbon (cross on top)
      const ribbonGeo = new THREE.BoxGeometry(0.3, 0.35, 2.6);
      const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 0.8 });
      const ribbonV = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbonV.position.y = 1.4;
      giftBoxGroup.add(ribbonV);

      const ribbonHGeo = new THREE.BoxGeometry(2.6, 0.35, 0.3);
      const ribbonH = new THREE.Mesh(ribbonHGeo, ribbonMat);
      ribbonH.position.y = 1.4;
      giftBoxGroup.add(ribbonH);

      // Bow on top - làm đẹp hơn với 2 vòng nơ
      const bowMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.3, metalness: 0.5 });
      
      // Nơ trái
      const bowLeftGeo = new THREE.TorusGeometry(0.35, 0.12, 8, 16);
      const bowLeft = new THREE.Mesh(bowLeftGeo, bowMat);
      bowLeft.position.set(-0.25, 1.8, 0);
      bowLeft.rotation.y = Math.PI / 4;
      bowLeft.rotation.x = Math.PI / 2;
      giftBoxGroup.add(bowLeft);
      
      // Nơ phải
      const bowRightGeo = new THREE.TorusGeometry(0.35, 0.12, 8, 16);
      const bowRight = new THREE.Mesh(bowRightGeo, bowMat);
      bowRight.position.set(0.25, 1.8, 0);
      bowRight.rotation.y = -Math.PI / 4;
      bowRight.rotation.x = Math.PI / 2;
      giftBoxGroup.add(bowRight);
      
      // Nút giữa nơ
      const bowCenterGeo = new THREE.SphereGeometry(0.15, 16, 16);
      const bowCenter = new THREE.Mesh(bowCenterGeo, bowMat);
      bowCenter.position.y = 1.7;
      giftBoxGroup.add(bowCenter);

      giftBoxGroup.position.set(x, -2.2, z);
      giftBoxGroup.userData = { 
        originalY: -2.2, 
        color, 
        id: i,
        animating: false,
        lid,
        foodItem: shuffledFood[i] || null,
        index: i
      };
      
      sceneRef.current.add(giftBoxGroup);
      setBagsRef(prev => [...prev, giftBoxGroup]);
      boxIndex++;
    }

    return () => {
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
      setBagsRef([]);
    };
  }, [sceneRef, setBagsRef, foodItems, boxCount]);

  useEffect(() => {
    const animate = () => {
      bagsRef.current.forEach((bag, index) => {
        if (isBusy || bag.userData.animating) return;

        const isHovered = hoveredBag === bag.userData.index;
        
        if (isHovered) {
          // Bay lên cao hơn khi hover
          bag.position.y = THREE.MathUtils.lerp(bag.position.y, 2, 0.1);
          bag.rotation.y += 0.05;
          bag.scale.setScalar(THREE.MathUtils.lerp(bag.scale.x, 1.2, 0.1));
        } else {
          const time = Date.now() * 0.002 + index;
          const floatY = bag.userData.originalY + Math.sin(time) * 0.15;
          bag.position.y = THREE.MathUtils.lerp(bag.position.y, floatY, 0.05);
          bag.rotation.y = THREE.MathUtils.lerp(bag.rotation.y, 0, 0.1);
          bag.scale.setScalar(THREE.MathUtils.lerp(bag.scale.x, 1, 0.1));
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, [hoveredBag, isBusy, bagsRef]);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const bag = e.object.parent;
    if (bag && bag.userData.index !== undefined) {
      setHoveredBag(bag.userData.index);
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHoveredBag(null);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (isBusy) return;
    const bag = e.object.parent;
    if (bag && bag.userData.index !== undefined) {
      onBagClick(bag);
    }
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[15, 25, 20]} intensity={1.5} castShadow />
      <pointLight position={[-10, 5, 10]} intensity={0.8} color={0x00ff88} />
      <spotLight position={[0, 15, -15]} intensity={1} angle={Math.PI / 4} />
      
      <group ref={sceneRef}>
        {bagsRef.current.map((bag, index) => (
          <primitive
            key={index}
            object={bag}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
          />
        ))}
      </group>
      
      <OrbitControls enableDamping dampingFactor={0.05} />
    </>
  );
};

const MysteryBagPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isBusy, setIsBusy] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [currentPrize, setCurrentPrize] = useState(null);
  const [cartCount, setCartCount] = useState(3);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boxCount, setBoxCount] = useState(Math.floor(Math.random() * 9) + 1);
  const [openedBag, setOpenedBag] = useState(null);
  const [rollCredits, setRollCredits] = useState(0);
  const sceneRef = useRef();
  const bagsRef = useRef([]);
  const [bags, setBags] = useState([]);
  const cameraRef = useRef();

  // Load food items from API (getAllProducts from database) or fallback to mock data
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        // Try API first - getAllProducts to get all items from database
        const response = await getAllProducts();
        console.log('API Response:', response);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setFoodItems(response.data);
          console.log('Food items loaded from API:', response.data.length);
          console.log('=== SAMPLE FOOD ITEM ===');
          console.log('Full object:', response.data[0]);
          console.log('All keys:', Object.keys(response.data[0]));
          console.log('========================');
        } else {
          console.log('API returned empty data, using mock data');
          // Fallback to mock data
          const mockFoodItems = [
            {
              ItemId: 1,
              ItemName: 'Cơm Gà Sốt Xốt',
              ImageUrl: 'https://via.placeholder.com/150',
              CategoryName: 'Cơm',
              DiscountedPrice: 45000
            },
            {
              ItemId: 2,
              ItemName: 'Phở Bò Tái',
              ImageUrl: 'https://via.placeholder.com/150',
              CategoryName: 'Phở',
              DiscountedPrice: 35000
            },
            {
              ItemId: 3,
              ItemName: 'Bún Chả Hà Nội',
              ImageUrl: 'https://via.placeholder.com/150',
              CategoryName: 'Bún',
              DiscountedPrice: 40000
            },
            {
              ItemId: 4,
              ItemName: 'Bánh Mì Thịt',
              ImageUrl: 'https://via.placeholder.com/150',
              CategoryName: 'Bánh Mì',
              DiscountedPrice: 25000
            },
            {
              ItemId: 5,
              ItemName: 'Gỏi Cuốn Tôm Thịt',
              ImageUrl: 'https://via.placeholder.com/150',
              CategoryName: 'Gỏi',
              DiscountedPrice: 30000
            },
            {
              ItemId: 6,
              ItemName: 'Chả Giò Rế',
              ImageUrl: 'https://via.placeholder.com/150',
              CategoryName: 'Chả Giò',
              DiscountedPrice: 35000
            },
            {
              ItemId: 7,
              ItemName: 'Bún Riêu Cua',
              ImageUrl: 'https://via.placeholder.com/150',
              CategoryName: 'Bún',
              DiscountedPrice: 40000
            },
            {
              ItemId: 8,
              ItemName: 'Mì Quảng',
              ImageUrl: 'https://via.placeholder.com/150',
              CategoryName: 'Mì',
              DiscountedPrice: 35000
            },
            {
              ItemId: 9,
              ItemName: 'Bún Đậu Mắm Tôm',
              ImageUrl: 'https://via.placeholder.com/150',
              CategoryName: 'Bún',
              DiscountedPrice: 45000
            }
          ];
          setFoodItems(mockFoodItems);
          console.log('Food items loaded from mock data:', mockFoodItems.length);
        }
      } catch (error) {
        console.error('Error fetching food items:', error);
        // Fallback to mock data on error
        const mockFoodItems = [
          {
            ItemId: 1,
            ItemName: 'Cơm Gà Sốt Xốt',
            ImageUrl: 'https://via.placeholder.com/150',
            CategoryName: 'Cơm',
            DiscountedPrice: 45000
          },
          {
            ItemId: 2,
            ItemName: 'Phở Bò Tái',
            ImageUrl: 'https://via.placeholder.com/150',
            CategoryName: 'Phở',
            DiscountedPrice: 35000
          },
          {
            ItemId: 3,
            ItemName: 'Bún Chả Hà Nội',
            ImageUrl: 'https://via.placeholder.com/150',
            CategoryName: 'Bún',
            DiscountedPrice: 40000
          },
          {
            ItemId: 4,
            ItemName: 'Bánh Mì Thịt',
            ImageUrl: 'https://via.placeholder.com/150',
            CategoryName: 'Bánh Mì',
            DiscountedPrice: 25000
          },
          {
            ItemId: 5,
            ItemName: 'Gỏi Cuốn Tôm Thịt',
            ImageUrl: 'https://via.placeholder.com/150',
            CategoryName: 'Gỏi',
            DiscountedPrice: 30000
          },
          {
            ItemId: 6,
            ItemName: 'Chả Giò Rế',
            ImageUrl: 'https://via.placeholder.com/150',
            CategoryName: 'Chả Giò',
            DiscountedPrice: 35000
          },
          {
            ItemId: 7,
            ItemName: 'Bún Riêu Cua',
            ImageUrl: 'https://via.placeholder.com/150',
            CategoryName: 'Bún',
            DiscountedPrice: 40000
          },
          {
            ItemId: 8,
            ItemName: 'Mì Quảng',
            ImageUrl: 'https://via.placeholder.com/150',
            CategoryName: 'Mì',
            DiscountedPrice: 35000
          },
          {
            ItemId: 9,
            ItemName: 'Bún Đậu Mắm Tôm',
            ImageUrl: 'https://via.placeholder.com/150',
            CategoryName: 'Bún',
            DiscountedPrice: 45000
          }
        ];
        setFoodItems(mockFoodItems);
        console.log('Food items loaded from mock data (error fallback):', mockFoodItems.length);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  // Load roll credits on component mount
  useEffect(() => {
    const fetchRollCredits = async () => {
      try {
        const response = await getRollCredits();
        if (response.data && response.data.data && response.data.data.credits !== undefined) {
          setRollCredits(response.data.data.credits);
          localStorage.setItem('rollCredits', String(response.data.data.credits));
        } else if (response.data && response.data.credits !== undefined) {
          setRollCredits(response.data.credits);
          localStorage.setItem('rollCredits', String(response.data.credits));
        }
      } catch (error) {
        console.error('Error fetching roll credits:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('rollCredits');
        setRollCredits(saved ? parseInt(saved, 10) : 0);
      }
    };

    fetchRollCredits();
  }, []);

  useEffect(() => {
    // Initialize sparkles
    const sparkleContainer = document.createElement('div');
    sparkleContainer.id = 'hero-sparkle-container';
    sparkleContainer.className = 'fixed inset-0 pointer-events-none z-0';
    document.body.appendChild(sparkleContainer);

    for (let i = 0; i < 40; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'hero-sparkle';
      const size = Math.random() * 4 + 2;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
      sparkle.style.animationDelay = `${Math.random() * 5}s`;
      sparkleContainer.appendChild(sparkle);
    }

    return () => {
      document.body.removeChild(sparkleContainer);
    };
  }, []);

  const handleBagClick = async (bag) => {
    if (bag.userData.animating || isBusy) return;
    
    // Check if user has roll credits
    if (rollCredits <= 0) {
      alert('Bạn không có lượt bốc! Hãy mua thêm lượt để tiếp tục.');
      return;
    }

    bag.userData.animating = true;
    setIsBusy(true);

    try {
      // Use 1 roll credit (best-effort API call)
      try {
        await useRollCredit();
      } catch (e) {
        console.warn('API useRollCredit failed, updating locally:', e);
      }
      const newCredits = rollCredits - 1;
      setRollCredits(newCredits);
      localStorage.setItem('rollCredits', String(newCredits));

      // Set current prize from the box's food item
      const foodItem = bag.userData.foodItem;
      console.log('Selected food item:', foodItem);
      console.log('All keys:', Object.keys(foodItem));
      console.log('ItemName:', foodItem.ItemName);
      console.log('ImageUrl:', foodItem.ImageUrl);
      console.log('CategoryName:', foodItem.CategoryName);
      console.log('DiscountedPrice:', foodItem.DiscountedPrice);
      setCurrentPrize(foodItem);
      setOpenedBag(bag);

      const tl = gsap.timeline();
      
      // Lift the box up - giảm độ cao từ 8 xuống 4
      tl.to(bag.position, { x: 0, z: 0, y: 4, duration: 1, ease: "power3.inOut" });
      tl.to(bag.rotation, { x: 0, y: Math.PI * 2, z: 0, duration: 1 }, "-=1");
      
      if (cameraRef.current) {
        tl.to(cameraRef.current.position, { z: 20, duration: 1 }, "-=1");
      }

      // Shake animation
      tl.add(() => {
        gsap.to(bag.position, { x: 0.1, duration: 0.1, repeat: 5, yoyo: true });
      });

      // Open box lid
      tl.to(bag.userData.lid.position, { y: 2, duration: 0.5, ease: "power2.out" }, "+=0.5");
      tl.to(bag.userData.lid.rotation, { x: -Math.PI / 4, duration: 0.6, ease: "back.out(2)" }, "-=0.4");

      // Show prize after delay
      tl.add(() => {
        setShowReveal(true);
      }, "+=0.5");
    } catch (error) {
      console.error('Error using roll credit:', error);
      alert('Có lỗi xảy ra khi sử dụng lượt bốc. Vui lòng thử lại.');
      setIsBusy(false);
      bag.userData.animating = false;
    }
  };

  const handleConfirmPrize = async () => {
    setShowReveal(false);
    setCartCount(prev => prev + 1);
    // Add a roll credit after purchase
    try {
      await addRollCredits(1);
      setRollCredits(prev => prev + 1);
    } catch (e) {
      console.error('Error adding roll credit after purchase:', e);
    }
    setIsBusy(false);
    
    // Remove the opened box from scene
    if (openedBag && sceneRef.current) {
      sceneRef.current.remove(openedBag);
      setBagsRef(prev => prev.filter(bag => bag !== openedBag));
      setOpenedBag(null);
    }
    
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, { z: 26, duration: 1 });
    }
  };

  const handlePickAnother = () => {
    setShowReveal(false);
    setIsBusy(false);
    
    // Remove the opened box from scene
    if (openedBag && sceneRef.current) {
      sceneRef.current.remove(openedBag);
      setBagsRef(prev => prev.filter(bag => bag !== openedBag));
      setOpenedBag(null);
    }
    
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, { z: 26, duration: 1 });
    }
  };

  const handleDrawBtn = () => {
    if (bags.length > 0 && !isBusy) {
      const randomBag = bags[Math.floor(Math.random() * bags.length)];
      handleBagClick(randomBag);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="bg-surface-container text-on-surface font-body-md min-h-screen relative overflow-x-hidden">
      {/* Atmospheric Elements */}
      <div className="fixed inset-0 pointer-events-none z-0" id="hero-sparkle-container">
        <div className="absolute top-20 left-10 opacity-20 leaf-float" style={{ animationDelay: '0s' }}>
          <span className="material-symbols-outlined text-primary text-6xl">eco</span>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20 leaf-float" style={{ animationDelay: '1s' }}>
          <span className="material-symbols-outlined text-primary text-8xl">eco</span>
        </div>
        <div className="absolute top-1/2 left-[5%] opacity-10 leaf-float" style={{ animationDelay: '2.5s' }}>
          <span className="material-symbols-outlined text-tertiary text-4xl">local_florist</span>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-container-padding pt-20 pb-8">
        {/* Hero Section */}
        <section className="text-center mb-6 relative">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-4">Trải Nghiệm Túi Mù May Mắn</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Khám phá hương vị bất ngờ từ Alibaba Food. Mỗi chiếc túi mù là một hành trình ẩm thực hữu cơ mới mẻ, mang lại niềm vui và sức khỏe cho gia đình bạn.
          </p>
          {/* Roll Credits Display */}
          <div className="mt-4 inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border border-primary/20">
            <span className="material-symbols-outlined text-primary text-2xl">confirmation_number</span>
            <span className="text-on-surface font-bold text-lg">Lượt bốc còn lại:</span>
            <span className={`font-bold text-2xl ${rollCredits > 0 ? 'text-primary' : 'text-red-500'}`}>{rollCredits}</span>
            {rollCredits <= 0 && (
              <button 
                className="ml-2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all"
                onClick={() => {
                  addToCart({ name: 'Bộ Sưu Tập Mới - Túi Mù May Mắn', price: 149000, quantity: 1 });
                  navigate('/checkout');
                }}
              >
                MUA LƯỢT
              </button>
            )}
          </div>
        </section>

        {/* The 3D Stage Section */}
        <div className="relative max-w-7xl mx-auto">
          <div className="shadow-[0_32px_64px_-12px_rgba(0,109,54,0.3)] border border-primary/20" id="three-container" style={{ height: '500px', borderRadius: '40px', overflow: 'hidden', background: 'radial-gradient(circle at center, #4ade80 0%, #006d36 100%)' }}>
            {loading ? (
              <div className="flex items-center justify-center h-full text-white">
                <p>Đang tải...</p>
              </div>
            ) : (
              <Canvas camera={{ position: [0, 8, 26], fov: 40 }}>
                <MysteryBagScene 
                  onBagClick={handleBagClick} 
                  isBusy={isBusy} 
                  sceneRef={sceneRef}
                  bagsRef={bagsRef}
                  setBagsRef={setBags}
                  foodItems={foodItems}
                  boxCount={boxCount}
                />
              </Canvas>
            )}
          </div>

          {/* CTA Button - Outside container, bottom right */}
          <button 
            className="absolute bottom-4 right-4 bg-primary text-white font-bold py-4 px-8 rounded-full shadow-2xl flex items-center gap-3 hover:scale-110 active:scale-95 transition-all group overflow-hidden relative z-50 border-2 border-white/30"
            onClick={handleDrawBtn}
            disabled={isBusy || rollCredits <= 0}
            id="draw-btn"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="material-symbols-outlined text-3xl">celebration</span>
            <span className="font-headline-sm uppercase tracking-wide">BỐC NGAY</span>
          </button>

          {/* Featured Image Overlay Card */}
          <div className="mt-6 flex justify-center">
            <div className="relative w-full max-w-3xl h-48 md:h-56 bg-white rounded-3xl overflow-hidden shadow-xl flex border border-primary/10 hover:shadow-2xl transition-shadow duration-500">
              <div className="w-1/2 p-8 flex flex-col justify-center">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Bộ Sưu Tập Mới</h3>
                <p className="text-on-surface-variant text-sm mb-6">Được tuyển chọn từ những nông trại đạt chuẩn Global GAP, mang lại chất lượng tuyệt hảo cho mỗi túi mù.</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">RARE</span>
                  <span className="text-primary font-bold">149.000đ</span>
                </div>
                <button 
                  className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all"
                  onClick={() => {
                    addToCart({ name: 'Bộ Sưu Tập Mới - Túi Mù May Mắn', price: 149000, quantity: 1 });
                    navigate('/checkout');
                  }}
                >
                  MUA NGAY
                </button>
              </div>
              <div className="w-1/2 relative bg-surface-container-highest">
                <img alt="Organic cookies collection" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChnZZngTIK0JjO5cB7LSkX_p0nf5_Y_IK8OM1dFU6uxQbhgnb1iG5cFGuaINIqMLIyLudmPeu_E_cIsM8Y5178grAqJDwbw_6F3ZgoNMiIx4t7MNMLGNP7O4FgS_HaQEGsXJvmXwTx3C0ILMx0zD4alusA49I0cpcgz2Bw64Oj_LjGadBo4FyruyzamQZobJaaeuJKMW2jys45fAHug4Nkg1BB9Aes00ffqT2mWtvrmwipM6LqSKyJ8eA5QhwH508kJdP79R49jbBb"/>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions/Benefits */}
        <section className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-container text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-md">
            <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">card_giftcard</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-3">Quà Tặng Bất Ngờ</h4>
            <p className="text-on-surface-variant">Luôn có những món quà bí mật đi kèm trong mỗi chiếc túi mù may mắn.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-container text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-md">
            <div className="w-16 h-16 bg-tertiary-container/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-tertiary text-3xl">verified</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-3">Chất Lượng Hữu Cơ</h4>
            <p className="text-on-surface-variant">100% nguyên liệu tươi sạch, nguồn gốc rõ ràng từ các đối tác Alibaba Food.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-container text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-md">
            <div className="w-16 h-16 bg-secondary-container/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-secondary text-3xl">local_shipping</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-3">Giao Hàng Siêu Tốc</h4>
            <p className="text-on-surface-variant">Tận hưởng cảm giác bóc túi mù chỉ sau 30 phút đặt hàng tại nội thành.</p>
          </div>
        </section>
      </main>

      {/* Reveal Overlay - Show Prize */}
      {showReveal && currentPrize && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center pt-20 transition-opacity duration-500" id="reveal-overlay">
          <div className="relative bg-white rounded-[40px] p-6 md:p-8 max-w-md w-full text-center transform transition-transform duration-500" id="reveal-card">
            <h2 className="font-headline-lg text-primary mb-4 text-2xl">Chúc Mừng Bạn!</h2>
            <p className="font-body-md text-on-surface-variant mb-6">
              Bạn đã nhận được món ăn từ hộp quà may mắn!
            </p>
            
            <div className="aspect-square bg-surface-container-low rounded-3xl mb-6 flex items-center justify-center relative overflow-hidden group">
              <img 
                className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110" 
                src={currentPrize.imageUrl || currentPrize.ImageUrl || currentPrize.Images?.[0]?.url || 'https://via.placeholder.com/150'} 
                alt={currentPrize.itemName || currentPrize.ItemName || currentPrize.Name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                }}
              />
              <div className="absolute top-3 right-3">
                <span className="bg-tertiary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {currentPrize.categoryName || currentPrize.CategoryName || currentPrize.Category?.Name}
                </span>
              </div>
            </div>
            
            <h3 className="font-headline-sm text-on-surface mb-2">{currentPrize.itemName || currentPrize.ItemName || currentPrize.Name || 'Món ăn'}</h3>
            <p className="text-primary font-bold text-xl mb-6">{formatPrice(currentPrize.discountedPrice || currentPrize.DiscountedPrice || currentPrize.originalPrice || currentPrize.OriginalPrice || currentPrize.Price || 0)}</p>
            
            <div className="flex flex-col gap-3">
              <button 
                className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all w-full"
                onClick={handleConfirmPrize}
              >
                XÁC NHẬN & VỀ GIỎ HÀNG
              </button>
              <button 
                className="text-primary font-bold hover:underline transition-all text-sm"
                onClick={handlePickAnother}
              >
                BỐC HỘP KHÁC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MysteryBagPage;
