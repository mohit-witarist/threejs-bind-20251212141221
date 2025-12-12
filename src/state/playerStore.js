import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
  speed: 5,
  isRunning: false,
  isJumping: false,
  isGrounded: true,
  velocity: [0, 0, 0],
  
  inventory: [],
  equippedItem: null,
  
  setHealth: (health) => set({ health: Math.max(0, Math.min(health, get().maxHealth)) }),
  setStamina: (stamina) => set({ stamina: Math.max(0, Math.min(stamina, get().maxStamina)) }),
  setIsRunning: (running) => set({ isRunning: running }),
  setIsJumping: (jumping) => set({ isJumping: jumping }),
  setIsGrounded: (grounded) => set({ isGrounded: grounded }),
  setVelocity: (velocity) => set({ velocity }),
  
  addToInventory: (item) => set((state) => ({
    inventory: [...state.inventory, item]
  })),
  
  removeFromInventory: (itemId) => set((state) => ({
    inventory: state.inventory.filter(item => item.id !== itemId)
  })),
  
  equipItem: (item) => set({ equippedItem: item }),
  unequipItem: () => set({ equippedItem: null }),
  
  takeDamage: (amount) => {
    const newHealth = get().health - amount;
    set({ health: Math.max(0, newHealth) });
  },
  
  heal: (amount) => {
    const newHealth = get().health + amount;
    set({ health: Math.min(newHealth, get().maxHealth) });
  },
  
  useStamina: (amount) => {
    const newStamina = get().stamina - amount;
    set({ stamina: Math.max(0, newStamina) });
  },
  
  regenerateStamina: (amount) => {
    const newStamina = get().stamina + amount;
    set({ stamina: Math.min(newStamina, get().maxStamina) });
  },
  
  reset: () => set({
    health: 100,
    stamina: 100,
    isRunning: false,
    isJumping: false,
    isGrounded: true,
    velocity: [0, 0, 0],
    inventory: [],
    equippedItem: null,
  }),
}));
