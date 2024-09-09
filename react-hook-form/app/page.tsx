'use client'

import {FormProvider, useForm} from "react-hook-form"
import {CharacterAttributes} from '@/components/CharacterAttributes'
import {InventoryForm} from '@/components/InventoryForm'
import {SkillsForm} from '@/components/SkillsForm'
import {CompanionForm} from '@/components/CompanionForm'
import {Button} from "@/components/ui/button"
import {useEffect, useState} from "react";
import {characterTemplates} from "@/components/CharacterData";
import {generateImage, GenerateImageResponse} from "@/lib/openai";
import {Loader2} from "lucide-react";
import Image from "next/image";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function CharacterCreationForm() {

    const [result, setResult] = useState<GenerateImageResponse>('');

    const methods = useForm<CharacterData>({
        defaultValues: characterTemplates.Warrior, // Start with the Warrior template
    });

    const {watch, reset} = methods;

    // Watch the selected class
    const selectedClass = watch("class");

    // Update the form values when the class changes
    useEffect(() => {
        if (selectedClass && characterTemplates[selectedClass]) {
            // Reset the form with the new class defaults
            reset(characterTemplates[selectedClass]);
        }
    }, [selectedClass, reset]);

    const onSubmit = async (data: CharacterData) => {
        console.log("Character Data: ", data);
        const response = await generateImage(data);
        console.dir(response);

        if (!response.error) {
            setResult(response);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Adventure Character Creation</h1>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                    <CharacterAttributes/>
                    <InventoryForm/>
                    <SkillsForm/>
                    <CompanionForm/>
                    <Button type="submit" className="w-full">Create Character</Button>
                    {/* Dialog Popup */}
                    <AlertDialog open={methods.formState.isSubmitting || methods.formState.isSubmitSuccessful}>
                        <AlertDialogTrigger/>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{methods.formState.isSubmitting ? 'Generating...' : result.name}</AlertDialogTitle>
                            </AlertDialogHeader>
                                {methods.formState.isSubmitting ? (
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    </div>
                                ) : (
                                    <div className={"w-full"}>
                                        <AspectRatio ratio={1}>
                                            <Image src={result.url} alt={"character"} fill
                                                   className={"rounded-md object-cover"}/>
                                        </AspectRatio>
                                        <AlertDialogDescription>
                                            {result.url}
                                        </AlertDialogDescription>
                                    </div>
                                )}
                            <AlertDialogAction onClick={() => methods.reset()}>Done</AlertDialogAction>
                        </AlertDialogContent>
                    </AlertDialog>
                </form>
            </FormProvider>
        </div>
    )
}
