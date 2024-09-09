
export interface CharacterData {
    characterName: string
    class: string
    attributes: {
        strength: number
        dexterity: number
        intelligence: number
    }
    inventory: {
        weapons: Array<{ name: string; damage: number }>
        armor: { name: string; defense: number }
    }
    skills: Array<{ name: string; level: number }>
    companions: Array<{ name: string; type: string; strength: number }>
}

// Predefined character templates for each class
export const characterTemplates: Record<string, CharacterData> = {
    Warrior: {
        characterName: "Thorin",
        class: "Warrior",
        attributes: { strength: 18, dexterity: 12, intelligence: 7 },
        inventory: {
            weapons: [{ name: "Great Axe", damage: 20 }, { name: "Dagger", damage: 6 }],
            armor: { name: "Plate Armor", defense: 25 }
        },
        skills: [{ name: "Whirlwind Attack", level: 3 }, { name: "Defensive Stance", level: 2 }],
        companions: [{ name: "Bear", type: "Animal", strength: 10 }]
    },
    Mage: {
        characterName: "Aeris",
        class: "Mage",
        attributes: { strength: 5, dexterity: 10, intelligence: 18 },
        inventory: {
            weapons: [{ name: "Staff of Fire", damage: 15 }, { name: "Magic Dagger", damage: 5 }],
            armor: { name: "Robe of the Archmage", defense: 5 }
        },
        skills: [{ name: "Fireball", level: 4 }, { name: "Teleport", level: 2 }],
        companions: [{ name: "Phoenix", type: "Mystical", strength: 8 }]
    },
    Rogue: {
        characterName: "Shadow",
        class: "Rogue",
        attributes: { strength: 10, dexterity: 18, intelligence: 10 },
        inventory: {
            weapons: [{ name: "Dual Daggers", damage: 12 }, { name: "Throwing Stars", damage: 7 }],
            armor: { name: "Leather Armor", defense: 12 }
        },
        skills: [{ name: "Backstab", level: 3 }, { name: "Shadowstep", level: 2 }],
        companions: [{ name: "Raven", type: "Animal", strength: 4 }]
    }
    // Add more character templates as needed
};
