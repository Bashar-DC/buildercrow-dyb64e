import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  Menu as MenuIcon,
  ArrowRight,
  Search,
  Sparkles,
  Calendar,
  Clock,
  User,
  ChefHat,
  Check,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Maximize2
} from 'lucide-react';

// Types
interface MenuItem {
  id: string;
  name: string;
  category: 'burgers' | 'sides' | 'drinks';
  description: string;
  price: number;
  image: string;
  badge?: string;
  calories?: number;
}

interface CartItem extends MenuItem {
  quantity: number;
  customizations?: string[];
}

interface CustomBurgerLayer {
  id: string;
  name: string;
  type: 'bun' | 'patty' | 'cheese' | 'sauce' | 'topping';
  price: number;
  color: string; // Tailwinds bg-color representation
}

// Mock Data
const MENU_ITEMS: MenuItem[] = [
  {
    id: 'b1',
    name: 'The Obsidian Prime',
    category: 'burgers',
    description: 'Double Wagyu beef, activated charcoal brioche bun, black truffle aioli, melted mature white cheddar, and caramelized black pepper onions.',
    price: 19.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    badge: 'Signature',
    calories: 840
  },
  {
    id: 'b2',
    name: 'Alabaster Crisp',
    category: 'burgers',
    description: 'Crispy buttermilk chicken breast, classic white brioche, white pepper mayo, house-pickled cucumbers, and premium shredded iceberg lettuce.',
    price: 16.50,
    image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
    calories: 710
  },
  {
    id: 'b3',
    name: 'The Shadow Portobello',
    category: 'burgers',
    description: 'Smoked portobello mushroom cap, vegan mozzarella, charcoal bun, wild arugula, and a thick glaze of premium white balsamic reduction.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    badge: 'Vegan Option',
    calories: 590
  },
  {
    id: 'b4',
    name: 'Shattered White Smash',
    category: 'burgers',
    description: 'Three ultra-thin smashed prime beef patties, three slices of sharp Monterey Jack, house black-garlic paste, and toasted sourdough toast.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    calories: 950
  },
  {
    id: 's1',
    name: 'Monochrome Truffle Fries',
    category: 'sides',
    description: 'Thick hand-cut Idaho potatoes tossed in premium truffle salt, freshly grated white parmesan, and served with house charcoal mayo.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80',
    badge: 'Must Try',
    calories: 410
  },
  {
    id: 's2',
    name: 'Coal-Dusted Onion Rings',
    category: 'sides',
    description: 'Crisp, black-tempura battered jumbo onion rings served with a side of white pepper and cream cheese dipping whip.',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=800&q=80',
    calories: 380
  },
  {
    id: 'd1',
    name: 'The Velvet Charcoal Shake',
    category: 'drinks',
    description: 'Vanilla bean milkshake infused with culinary activated charcoal, topped with white chocolate flakes and a black cherry.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    badge: 'Specialty',
    calories: 520
  },
  {
    id: 'd2',
    name: 'Blanc-Noir Nitro Cold Brew',
    category: 'drinks',
    description: 'Slow-steeped dark roast cold brew infused with nitrogen, layered with a dense, sweet vanilla cream foam.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    calories: 120
  }
];

const CUSTOMIZER_OPTIONS: CustomBurgerLayer[] = [
  { id: 'bun-charcoal', name: 'Activated Charcoal Bun', type: 'bun', price: 2.50, color: 'bg-zinc-900 border-zinc-700 text-white' },
  { id: 'bun-white', name: 'White Brioche Bun', type: 'bun', price: 2.00, color: 'bg-zinc-100 border-zinc-300 text-zinc-900' },
  { id: 'patty-wagyu', name: 'Wagyu Beef Patty', type: 'patty', price: 7.00, color: 'bg-zinc-800 border-zinc-600 text-zinc-300' },
  { id: 'patty-portobello', name: 'Smoked Portobello', type: 'patty', price: 5.00, color: 'bg-zinc-700 border-zinc-500 text-zinc-200' },
  { id: 'cheese-cheddar', name: 'White Vintage Cheddar', type: 'cheese', price: 1.50, color: 'bg-zinc-50 border-zinc-200 text-zinc-800' },
  { id: 'cheese-mozzarella', name: 'Vegan Mozzarella', type: 'cheese', price: 2.00, color: 'bg-zinc-100 border-zinc-200 text-zinc-700' },
  { id: 'sauce-truffle', name: 'Black Truffle Aioli', type: 'sauce', price: 1.00, color: 'bg-zinc-950 border-zinc-800 text-zinc-400' },
  { id: 'sauce-mayo', name: 'White Pepper Mayo', type: 'sauce', price: 1.00, color: 'bg-zinc-200 border-zinc-300 text-zinc-600' },
  { id: 'topping-onions', name: 'Caramelized Onions', type: 'topping', price: 1.50, color: 'bg-zinc-600 border-zinc-500 text-zinc-100' },
  { id: 'topping-arugula', name: 'Wild Arugula', type: 'topping', price: 1.00, color: 'bg-zinc-300 border-zinc-400 text-zinc-800' }
];

export default function App() {
  // State Management
  const [activeTab, setActiveTab] = useState<'all' | 'burgers' | 'sides' | 'drinks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBurger, setSelectedBurger] = useState<MenuItem | null>(null);
  
  // Custom Burger State
  const [customStack, setCustomStack] = useState<CustomBurgerLayer[]>([
    CUSTOMIZER_OPTIONS[0], // Bottom Bun (placeholder logic: stack ordered bottom to top)
    CUSTOMIZER_OPTIONS[2], // Patty
    CUSTOMIZER_OPTIONS[4], // Cheese
    CUSTOMIZER_OPTIONS[1], // Top Bun
  ]);

  // Reservation State
  const [reservation, setReservation] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '2'
  });
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Menu Items
  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = activeTab === 'all' || item.category === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  // Add Item to Cart
  const addToCart = (item: MenuItem, customizations?: string[]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, customizations }];
    });
    triggerToast(`Added ${item.name} to your black bag.`);
  };

  // Customize & Add Custom Burger to Cart
  const addCustomBurgerToCart = () => {
    const customPrice = customStack.reduce((sum, layer) => sum + layer.price, 0);
    const customItem: MenuItem = {
      id: `custom-${Date.now()}`,
      name: 'Custom Noir Creation',
      category: 'burgers',
      description: `Bespoke Burger: ${customStack.map(l => l.name).join(', ')}`,
      price: customPrice,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    };
    addToCart(customItem);
    triggerToast('Custom creation added to your bag.');
  };

  // Remove / Update Quantities
  const updateQuantity = (id: string, amount: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  // Cart Totals
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);
  
  const tax = subtotal * 0.08;
  const delivery = subtotal > 40 ? 0 : subtotal > 0 ? 4.99 : 0;
  const total = subtotal + tax + delivery;

  // Layer manipulation inside Customizer
  const addLayerToStack = (layer: CustomBurgerLayer) => {
    setCustomStack(prev => {
      // Keep buns smart: insert patty/sauce/toppings in between bun layers
      const updated = [...prev];
      if (layer.type === 'bun') {
        // Swap or ensure we only have top/bottom bun
        const bottomIndex = updated.findIndex(l => l.type === 'bun');
        if (bottomIndex !== -1) {
          updated[bottomIndex] = layer;
        }
      } else {
        // Insert just before the top layer (which is typically a bun)
        updated.splice(updated.length - 1, 0, layer);
      }
      return updated;
    });
    triggerToast(`Layered ${layer.name}`);
  };

  const removeLayerFromStack = (index: number) => {
    if (customStack.length <= 2) {
      triggerToast("Your burger needs at least two layers!");
      return;
    }
    setCustomStack(prev => prev.filter((_, idx) => idx !== index));
  };

  // Submit Handlers
  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationSuccess(true);
    setTimeout(() => {
      setReservationSuccess(false);
      setReservation({ name: '', email: '', date: '', time: '', guests: '2' });
    }, 5000);
  };

  const handleCheckout = () => {
    setOrderSuccess(true);
    setCart([]);
    setIsCartOpen(false);
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black antialiased">
      {/* Dynamic Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-6 py-4 rounded-none border border-black shadow-2xl flex items-center space-x-3 tracking-wider text-sm font-mono uppercase"
          >
            <Sparkles className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal (Order & Reservation) */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 p-8 max-w-md w-full text-center space-y-6 rounded-none shadow-2xl"
            >
              <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-serif tracking-tight">ORDER RECEIVED</h3>
              <p className="text-zinc-400 text-sm">
                Your luxury monochrome meal has been sent to our master grill chefs. It will arrive at your destination in signature sleek packaging.
              </p>
              <div className="border-t border-b border-zinc-800 py-3 text-xs font-mono text-zinc-500 tracking-widest uppercase">
                Est. Delivery: 25 - 35 Mins
              </div>
              <button 
                onClick={() => setOrderSuccess(false)}
                className="w-full bg-white text-black py-4 hover:bg-zinc-200 transition-colors uppercase font-mono tracking-widest text-sm"
              >
                Close Window
              </button>
            </motion.div>
          </motion.div>
        )}

        {reservationSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 p-8 max-w-md w-full text-center space-y-6 rounded-none shadow-2xl"
            >
              <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Calendar className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-serif tracking-tight">RESERVATION CONFIRMED</h3>
              <p className="text-zinc-400 text-sm">
                Your private table is booked in our "Dark Room Lounge". We look forward to offering you an unmatched visual and culinary journey.
              </p>
              <div className="grid grid-cols-2 gap-4 border-t border-b border-zinc-800 py-3 text-xs font-mono text-zinc-400">
                <div>DATE: {reservation.date}</div>
                <div>TIME: {reservation.time}</div>
              </div>
              <button 
                onClick={() => setReservationSuccess(false)}
                className="w-full bg-white text-black py-4 hover:bg-zinc-200 transition-colors uppercase font-mono tracking-widest text-sm"
              >
                Understood
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Navigation */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 lg:px-16 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold tracking-tighter text-xl">
            N
          </div>
          <span className="text-2xl font-serif tracking-wider uppercase font-extrabold text-white">Noir Burger</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-10 text-sm tracking-widest uppercase font-mono text-zinc-400">
          <a href="#hero" className="hover:text-white transition-colors">Concept</a>
          <a href="#menu" className="hover:text-white transition-colors">Menu</a>
          <a href="#customizer" className="hover:text-white transition-colors">Lab</a>
          <a href="#reservation" className="hover:text-white transition-colors">Reservations</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 border border-zinc-800 hover:border-zinc-500 transition-colors bg-zinc-950"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-mono w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 border border-zinc-800 hover:border-zinc-500 transition-colors bg-zinc-950 md:hidden"
            aria-label="Toggle Menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-zinc-950 border-b border-zinc-900 z-30 p-8 flex flex-col space-y-6 md:hidden uppercase font-mono tracking-widest text-sm text-zinc-400"
          >
            <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Concept</a>
            <a href="#menu" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Menu</a>
            <a href="#customizer" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Lab</a>
            <a href="#reservation" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">Reservations</a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-16 py-12 overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 z-0 bg-radial-gradient">
          {/* Stark visual light ray element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-xs font-mono tracking-widest uppercase text-zinc-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>A Masterclass in Gastronomy</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-none tracking-tighter">
              DEVOUR THE <span className="font-sans font-black italic block text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">DARKNESS.</span>
            </h1>

            <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
              We stripped away the neon colors. We removed the clutter. Noir Burger is an intense exploration of visual purity and high-definition flavors. Premium Wagyu, charcoal buns, and pure culinary artistry.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="#menu" 
                className="bg-white text-black text-center py-4 px-8 uppercase font-mono tracking-widest text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-2 font-bold"
              >
                <span>View Menu</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#customizer" 
                className="bg-black text-white text-center py-4 px-8 uppercase font-mono tracking-widest text-sm border border-zinc-800 hover:border-zinc-500 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Burger Lab (DIY)</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[400px] aspect-square bg-zinc-950 border border-zinc-800 p-6 shadow-2xl group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-70" />
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" 
                alt="Obsidian Signature Burger"
                className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[1.5s]"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                <div>
                  <span className="text-xs font-mono text-zinc-400 tracking-widest block uppercase">THE SIGNATURE</span>
                  <span className="text-2xl font-serif text-white uppercase tracking-tight">Obsidian Prime</span>
                </div>
                <div className="bg-white text-black px-3 py-1 text-sm font-mono font-bold">$19.00</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-6 lg:left-16 hidden lg:flex items-center space-x-8 text-xs font-mono tracking-widest text-zinc-500">
          <span>01 // FRESH DAILY</span>
          <span>02 // NO PRESERVATIVES</span>
          <span>03 // HANDMADE CHARCOAL BUNS</span>
        </div>
      </section>

      {/* Interactive Burger Builder (The Lab) */}
      <section id="customizer" className="py-24 px-6 lg:px-16 border-b border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase block">EXPERIMENTAL KITCHEN</span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight uppercase">THE BLACK & WHITE BURGER LAB</h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
              Design your personalized monochrome masterpiece. Drag, drop, stack, and inspect your custom flavor profile before placing your order.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Visual Burger Stack Preview */}
            <div className="lg:col-span-5 bg-black border border-zinc-900 p-8 flex flex-col justify-between relative overflow-hidden min-h-[450px]">
              <div className="absolute top-4 left-4 text-[10px] font-mono text-zinc-500 tracking-wider">
                LIVE BUILD COMPILER
              </div>

              {/* Dynamic Stack Preview */}
              <div className="flex-1 flex flex-col justify-end items-center space-y-2 py-8 relative">
                <AnimatePresence>
                  {[...customStack].reverse().map((layer, index) => {
                    // Visual sizes based on burger logic (Buns are wider, patties thicker)
                    const isBun = layer.type === 'bun';
                    const isPatty = layer.type === 'patty';
                    const heightClass = isBun ? 'h-10 md:h-12 rounded-t-2xl' : isPatty ? 'h-8 md:h-9 rounded-md' : 'h-4 md:h-5 rounded';
                    const widthClass = isBun ? 'w-56 md:w-64' : isPatty ? 'w-52 md:w-60' : 'w-48 md:w-56';

                    return (
                      <motion.div
                        key={`${layer.id}-${index}`}
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ type: 'spring', stiffness: 120 }}
                        className={`relative flex items-center justify-center border font-mono text-xs uppercase tracking-widest select-none cursor-pointer transition-shadow shadow-md hover:shadow-lg ${widthClass} ${heightClass} ${layer.color}`}
                        onClick={() => removeLayerFromStack(customStack.length - 1 - index)}
                        title="Click to remove"
                      >
                        <span className="text-[10px] font-bold px-2 truncate">{layer.name}</span>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 opacity-0 hover:opacity-100 bg-black/80 px-1 py-0.5 rounded">
                          REMOVE
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="border-t border-zinc-900 pt-6 flex justify-between items-center text-sm font-mono">
                <div>
                  <span className="text-zinc-500 text-xs block">ESTIMATED COST</span>
                  <span className="text-xl font-bold">${customStack.reduce((sum, l) => sum + l.price, 0).toFixed(2)}</span>
                </div>
                <button
                  onClick={addCustomBurgerToCart}
                  className="bg-white text-black py-3 px-6 hover:bg-zinc-200 transition-colors uppercase text-xs tracking-wider font-bold"
                >
                  ADD TO BAG
                </button>
              </div>
            </div>

            {/* Selector Options */}
            <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
              <div>
                <h3 className="text-xl font-mono uppercase tracking-wider mb-2">Configure Layers</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Select to add layers onto your burger. Click layers in preview to remove.</p>
              </div>

              {/* Categories */}
              {['bun', 'patty', 'cheese', 'sauce', 'topping'].map((type) => {
                const options = CUSTOMIZER_OPTIONS.filter(o => o.type === type);
                return (
                  <div key={type} className="space-y-3">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">{type} options</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => addLayerToStack(option)}
                          className="flex items-center justify-between p-4 border border-zinc-900 hover:border-zinc-500 bg-black text-left transition-all group"
                        >
                          <div>
                            <span className="text-xs font-mono tracking-wider block font-bold text-zinc-300 group-hover:text-white transition-colors">{option.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">+ ${option.price.toFixed(2)}</span>
                          </div>
                          <Plus className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Menu Section */}
      <section id="menu" className="py-24 px-6 lg:px-16 max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8">
          <div className="space-y-3">
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase block">CRAFTED SELECTIONS</span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight uppercase">THE CHRONICLE MENU</h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="SEARCH DISHES..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-500 text-sm py-3 pl-10 pr-4 outline-none font-mono placeholder:text-zinc-700 tracking-widest uppercase text-white"
            />
            <Search className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 text-xs font-mono tracking-widest uppercase border-b border-zinc-950 pb-4">
          {(['all', 'burgers', 'sides', 'drinks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2.5 px-6 border transition-all ${
                activeTab === tab 
                  ? 'bg-white text-black border-white' 
                  : 'bg-transparent text-zinc-500 border-zinc-900 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-zinc-950 border border-zinc-900 group relative flex flex-col justify-between overflow-hidden"
              >
                {/* Image Wrap */}
                <div className="relative aspect-video overflow-hidden border-b border-zinc-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-60" />
                  
                  {item.badge && (
                    <span className="absolute top-3 left-3 z-20 bg-white text-black text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 font-bold">
                      {item.badge}
                    </span>
                  )}

                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale contrast-110 brightness-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                  />
                  
                  {/* Detailed inspector button */}
                  <button 
                    onClick={() => setSelectedBurger(item)}
                    className="absolute bottom-3 right-3 z-20 bg-black/80 hover:bg-white hover:text-black p-2 transition-colors border border-zinc-800"
                    title="View Details"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-lg font-serif tracking-tight text-white group-hover:text-zinc-200 transition-colors uppercase">
                        {item.name}
                      </h3>
                      <span className="font-mono text-zinc-300 font-bold">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full bg-transparent group-hover:bg-white text-white group-hover:text-black py-3 border border-zinc-800 group-hover:border-white transition-all text-xs font-mono tracking-widest uppercase flex items-center justify-center space-x-2 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredMenu.length === 0 && (
            <div className="col-span-full py-16 text-center text-zinc-500 font-mono tracking-wider text-sm">
              NO DISHES MATCHING "{searchQuery.toUpperCase()}" IN THIS DIVISION.
            </div>
          )}
        </div>
      </section>

      {/* Menu Item Detail Modal */}
      <AnimatePresence>
        {selectedBurger && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 p-8 max-w-2xl w-full relative grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <button 
                onClick={() => setSelectedBurger(null)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="aspect-square bg-black border border-zinc-900 overflow-hidden relative">
                <img 
                  src={selectedBurger.image} 
                  alt={selectedBurger.name}
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90"
                />
              </div>

              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">{selectedBurger.category}</span>
                    <h3 className="text-3xl font-serif tracking-tight uppercase">{selectedBurger.name}</h3>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {selectedBurger.description}
                  </p>
                  {selectedBurger.calories && (
                    <div className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">
                      Nutrition: ~{selectedBurger.calories} Calories
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-900">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Base Price</span>
                    <span className="font-mono text-xl font-bold">${selectedBurger.price.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(selectedBurger);
                      setSelectedBurger(null);
                    }}
                    className="w-full bg-white text-black py-4 uppercase font-mono tracking-widest text-xs font-bold hover:bg-zinc-200 transition-colors"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Ethos / Testimonials */}
      <section className="py-24 bg-zinc-950 border-t border-b border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase block">THE PHILOSOPHY</span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight uppercase leading-tight">
              A DRAMATIC STUDY OF CONTRAST.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We operate under the assumption that fine culinary art isn't just about taste. It is an emotional trigger. By darkening the elements, we heighten your sensory receptors. Every bite of warm Wagyu beef and sweet black garlic stands out against a backdrop of raw purity.
            </p>
            <div className="flex space-x-6 text-xs font-mono tracking-widest uppercase pt-2">
              <div className="flex items-center space-x-1.5">
                <ChefHat className="w-4 h-4 text-zinc-400" />
                <span>Elegance</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-zinc-400" />
                <span>Excellence</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black border border-zinc-900 p-8 space-y-6">
              <span className="text-5xl font-serif text-zinc-700 block">“</span>
              <p className="text-zinc-300 text-sm leading-relaxed italic">
                “This is the absolute pinnacle of luxury street dining. The Obsidian Burger is complex, rich, smoky, and absolutely spectacular to look at.”
              </p>
              <div className="border-t border-zinc-900 pt-4 flex justify-between items-center text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                <span>NEW YORK INSIDER</span>
                <span>★★★★★</span>
              </div>
            </div>

            <div className="bg-black border border-zinc-900 p-8 space-y-6">
              <span className="text-5xl font-serif text-zinc-700 block">“</span>
              <p className="text-zinc-300 text-sm leading-relaxed italic">
                “Perfect monochrome photography on their Instagram, but the real star is the taste. They transformed simple elements into true high art.”
              </p>
              <div className="border-t border-zinc-900 pt-4 flex justify-between items-center text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                <span>GASTRONOMY LAB</span>
                <span>★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation / Booking Lounge */}
      <section id="reservation" className="py-24 max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase block">VIP EXPERIENCE</span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight uppercase leading-none">
              RESERVE A CHAMBER
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Step into our "Dark Room Lounge" for an immersive multi-sensory dining experience with tailored projection mapping, customized music profiles, and absolute sensory privacy.
            </p>
            <div className="space-y-3 font-mono text-xs uppercase tracking-widest text-zinc-500">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span>404 Obsidian Boulevard, SoHo NYC</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>+1 (212) 555-NOIR</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 p-8 sm:p-12">
            <form onSubmit={handleReservationSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      value={reservation.name}
                      onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
                      placeholder="YOUR FULL NAME"
                      className="w-full bg-black border border-zinc-900 focus:border-zinc-500 text-xs py-3.5 px-4 outline-none font-mono placeholder:text-zinc-800 tracking-wider uppercase text-white"
                    />
                    <User className="w-4 h-4 text-zinc-700 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      value={reservation.email}
                      onChange={(e) => setReservation({ ...reservation, email: e.target.value })}
                      placeholder="YOUR_EMAIL@DOMAIN.COM"
                      className="w-full bg-black border border-zinc-900 focus:border-zinc-500 text-xs py-3.5 px-4 outline-none font-mono placeholder:text-zinc-800 tracking-wider text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required
                      value={reservation.date}
                      onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                      className="w-full bg-black border border-zinc-900 focus:border-zinc-500 text-xs py-3.5 px-4 outline-none font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Preferred Time</label>
                  <div className="relative">
                    <input 
                      type="time" 
                      required
                      value={reservation.time}
                      onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                      className="w-full bg-black border border-zinc-900 focus:border-zinc-500 text-xs py-3.5 px-4 outline-none font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Guests</label>
                  <div className="relative">
                    <select 
                      value={reservation.guests}
                      onChange={(e) => setReservation({ ...reservation, guests: e.target.value })}
                      className="w-full bg-black border border-zinc-900 focus:border-zinc-500 text-xs py-3.5 px-4 outline-none font-mono text-white appearance-none"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="4">4 People</option>
                      <option value="6">6+ (VIP Room)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-white text-black py-4 font-mono tracking-widest text-xs uppercase font-bold hover:bg-zinc-200 transition-colors"
              >
                REQUEST BOOKING
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="w-screen max-w-md bg-zinc-950 border-l border-zinc-900 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
                  <h3 className="text-lg font-serif tracking-tight uppercase">YOUR COAL BLACK BAG</h3>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <ShoppingBag className="w-12 h-12 text-zinc-800" />
                      <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Your bag is empty. Start adding obsidian delicacies.
                      </p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b border-zinc-900 pb-6 items-start">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover grayscale border border-zinc-900 flex-shrink-0"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-serif uppercase tracking-tight">{item.name}</h4>
                            <span className="font-mono text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          
                          {item.customizations && (
                            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                              Custom Build Stack Chosen
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-2 border border-zinc-900 px-2 py-1">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="text-zinc-500 hover:text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-mono w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="text-zinc-500 hover:text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button 
                              onClick={() => updateQuantity(item.id, -item.quantity)}
                              className="text-zinc-600 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Checkout Summary Footer */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-zinc-900 space-y-4 bg-black">
                    <div className="space-y-2 text-xs font-mono uppercase text-zinc-400">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes (8%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery fee</span>
                        <span>{delivery === 0 ? 'FREE' : `$${delivery.toFixed(2)}`}</span>
                      </div>
                      <div className="border-t border-zinc-900 pt-2 flex justify-between text-white font-bold text-sm">
                        <span>Grand Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full bg-white text-black py-4 uppercase font-mono tracking-widest text-xs font-bold hover:bg-zinc-200 transition-colors"
                    >
                      SECURE CHECKOUT
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-16 px-6 lg:px-16 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">
                N
              </div>
              <span className="text-xl font-serif tracking-wider uppercase font-extrabold">Noir Burger</span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
              Luxury gastronomy. Redefining modern taste aesthetics and sensory comfort in culinary designs.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300">Quick links</h4>
            <div className="flex flex-col space-y-2 text-xs font-mono uppercase tracking-wider text-zinc-500">
              <a href="#hero" className="hover:text-white">The Concept</a>
              <a href="#menu" className="hover:text-white">Our Menu</a>
              <a href="#customizer" className="hover:text-white">Burger Lab</a>
              <a href="#reservation" className="hover:text-white">Reservations</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300">Lounge Hours</h4>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 space-y-1">
              <p>Mon - Fri: 12:00 PM - 11:00 PM</p>
              <p>Sat - Sun: 11:00 AM - 1:00 AM</p>
              <p>VIP Dark Room: Invite Only</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300">Updates</h4>
            <p className="text-xs text-zinc-500">Subscribe to private test kitchen openings.</p>
            <form onSubmit={(e) => { e.preventDefault(); triggerToast('Subscribed.'); }} className="flex">
              <input 
                type="email" 
                placeholder="EMAIL..." 
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-500 text-xs py-2 px-3 outline-none font-mono text-white placeholder:text-zinc-800"
              />
              <button className="bg-white text-black px-4 hover:bg-zinc-200 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-zinc-950 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
          <span>&copy; {new Date().getFullYear()} NOIR GASTRONOMY CO. ALL RESERVED RIGHTS.</span>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}