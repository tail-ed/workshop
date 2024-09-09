import { useFieldArray, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function CompanionForm() {
    const { register, control } = useFormContext()
    const { fields: companions, append: appendCompanion, remove: removeCompanion } = useFieldArray({
        control,
        name: "companions"
    })

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Companions</h3>
            {companions.map((companion, index) => (
                <div key={companion.id} className="flex items-center space-x-2 mb-2">
                    <Input {...register(`companions.${index}.name`)} placeholder="Companion name" />
                    <Input {...register(`companions.${index}.type`)} placeholder="Type" />
                    <Input
                        {...register(`companions.${index}.strength`, { valueAsNumber: true })}
                        type="number"
                        placeholder="Strength"
                    />
                    <Button type="button" variant="destructive" onClick={() => removeCompanion(index)}>
                        Remove
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                onClick={() => appendCompanion({ name: "", type: "", strength: 0 })}
            >
                Add Companion
            </Button>
        </div>
    )
}
