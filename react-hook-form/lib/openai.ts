"use server";

import OpenAI from "openai";
import {CharacterData} from "@/app/components/CharacterData";

const openai = new OpenAI({
    organization: process.env.ORGANIZATION_ID,
});

export interface GenerateImageResponse {
    name?: string;
    url?: string;
    error?: string;
}

export async function generateImage(data: CharacterData) {

    // Generate the prompt using the character data
    const prompt = `
Create a fantasy game illustration featuring a ${data.class} in an action-packed scene. The ${data.class} is equipped with ${data.inventory.weapons.map(w => w.name).join(" and ")} and wearing ${data.inventory.armor.name} armor. They are showcasing their skills such as ${data.skills.map(s => s.name).join(" and ")}. The ${data.class} is accompanied by a ${data.companions.map(c => `${c.type} ${c.name}`).join(" and ")}. The scene is set in a dramatic landscape with epic lighting effects and detailed surroundings. Focus on capturing the dynamic action and detailed elements of the character and their companions. Image only, no typography.`;

    // wait 10s
    // await new Promise(resolve => setTimeout(resolve, 10000));

    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        // Assuming the response structure is { data: [{ url: string }] }
        const imageUrl = response.data[0].url;
        console.log("Generated Image URL: ", imageUrl);

        return {
            name: data.characterName,
            url: imageUrl
        };

        // Here you can handle the image URL as needed (e.g., display it to the user, save it, etc.)
    } catch (error) {
        console.error("Error generating image: ", error);
    }

    // return {
    //     name: data.characterName,
    //     url: "https://d36dz3u628srmn.cloudfront.net/public/warrior-bear.png"
    // };

    return {
        error: "Failed to generate image",
    };
}
