import {useFormContext} from "react-hook-form"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {characterTemplates} from "@/components/CharacterData";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

export function CharacterAttributes() {
    const {register, control} = useFormContext()

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="characterName">Character Name</Label>
                <Input id="characterName" {...register("characterName")} />
            </div>
            <div>
                <FormField
                    name="class"
                    control={control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Class</FormLabel>
                            <FormControl>
                                <Select defaultValue={field.value}
                                        onValueChange={(value) => field.onChange(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a class"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(characterTemplates).map((key) => (
                                            <SelectItem key={key} value={key}>
                                                {key}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription/>
                            <FormMessage/>
                        </FormItem>
                    )}/>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Attributes</h3>
                <div className="grid grid-cols-3 gap-4">
                    {["strength", "dexterity", "intelligence"].map((attr) => (
                        <div key={attr}>
                            <Label htmlFor={attr}>{attr.charAt(0).toUpperCase() + attr.slice(1)}</Label>
                            <Input
                                id={attr}
                                type="number"
                                {...register(`attributes.${attr}` as const, {valueAsNumber: true})}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
