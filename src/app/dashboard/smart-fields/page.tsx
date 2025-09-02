
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Map as MapIcon, PlusCircle, Wheat, Leaf, Tractor, Trash2, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { FieldAnalysis } from "@/components/dashboard/field-analysis";
import { useUserData } from "@/context/UserDataProvider";


export type Field = {
  id: string;
  name: string;
  cropType: string;
  plantingDate: Date;
  latitude: number;
  longitude: number;
};

export const cropTypes = [
    { value: "wheat", label: "Wheat", icon: Wheat },
    { value: "rice", label: "Rice", icon: Leaf },
    { value: "corn", label: "Corn", icon: Tractor },
    { value: "soybean", label: "Soybean", icon: Leaf },
    { value: "sugarcane", label: "Sugarcane", icon: Tractor },
];

export default function SmartFieldsPage() {
  const { fields, addField, deleteField, translate } = useUserData();
  const [selectedField, setSelectedField] = React.useState<Field | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = React.useState(false);
  
  const handleViewAnalysis = (field: Field) => {
    setSelectedField(field);
    setIsAnalysisOpen(true);
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
                <MapIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{translate("My Fields")}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">{translate("Define and manage your fields for AI-powered insights.")}</p>
            </div>
        </div>
        <AddFieldDialog onFieldAdd={addField} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{translate("Your Fields")}</CardTitle>
          <CardDescription>
            {translate("This is where your defined fields will appear. Click on a field for detailed analysis.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fields.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {fields.map((field, index) => {
                const CropIcon = cropTypes.find(c => c.value === field.cropType)?.icon || Leaf;
                const cropLabel = cropTypes.find(c => c.value === field.cropType)?.label || field.cropType;
                return (
                  <Card 
                    key={field.id} 
                    className="group relative hover:shadow-lg transition-shadow animate-slide-in-up"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <CropIcon className="w-8 h-8 text-primary" />
                        <CardTitle>{field.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {translate("Crop")}: <span className="font-medium text-foreground">{translate(cropLabel)}</span>
                      </p>
                       <p className="text-sm text-muted-foreground">
                        {translate("Planted")}: <span className="font-medium text-foreground">{format(new Date(field.plantingDate), "PPP")}</span>
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {field.latitude.toFixed(2)}, {field.longitude.toFixed(2)}
                      </p>
                    </CardContent>
                    <CardFooter>
                       <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewAnalysis(field)}>{translate("View Analysis")}</Button>
                    </CardFooter>
                     <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteField(field.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{translate("Delete field")}</span>
                      </Button>
                  </Card>
                );
              })}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-center gap-4 h-96 border-2 border-dashed rounded-lg bg-muted/50 animate-fade-in">
                <div className="flex items-center gap-4">
                    <MapIcon className="w-12 h-12 text-muted-foreground" />
                    <div className="text-muted-foreground">
                        <p className="font-semibold text-lg">{translate("No fields defined yet.")}</p>
                        <p className="text-sm">{translate("Click \"Add New Field\" to get started.")}</p>
                    </div>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedField && (
        <Dialog open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{translate("Analysis for")} {selectedField.name}</DialogTitle>
                    <DialogDescription>
                        {translate("Crop")}: {translate(cropTypes.find(c => c.value === selectedField.cropType)?.label || '')} | {translate("Planted")}: {format(new Date(selectedField.plantingDate), "PPP")}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-auto pr-2">
                  <FieldAnalysis field={selectedField} />
                </div>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}


function AddFieldDialog({ onFieldAdd }: { onFieldAdd: (field: Omit<Field, 'id'>) => void }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [cropType, setCropType] = React.useState("");
  const [plantingDate, setPlantingDate] = React.useState<Date | undefined>(new Date());
  const [isGettingLocation, setIsGettingLocation] = React.useState(false);
  const { toast } = useToast();
  const { translate } = useUserData();

  const handleReset = () => {
    setName("");
    setCropType("");
    setPlantingDate(new Date());
    setIsGettingLocation(false);
  }

  const handleSubmit = async () => {
    if (!name.trim() || !cropType || !plantingDate) {
       toast({
        title: translate("Missing Information"),
        description: translate("Please fill out all fields to add a new field."),
        variant: "destructive",
      });
      return;
    }
    
    setIsGettingLocation(true);

    const getLocation = new Promise<{latitude: number; longitude: number}>((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation is not supported by your browser."));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        (error) => reject(error)
      );
    });

    try {
      const { latitude, longitude } = await getLocation;
      onFieldAdd({
        name: name.trim(),
        cropType,
        plantingDate,
        latitude,
        longitude,
      });
      toast({
          title: translate("Field Added"),
          description: `${translate("Your field")} "${name.trim()}" ${translate("has been successfully added.")}`,
      });
      handleReset();
      setOpen(false);

    } catch (error) {
        const errorMessage = (error as GeolocationPositionError).message || "An unknown error occurred.";
        console.error("Geolocation error:", error);
        toast({
            title: translate("Could Not Get Location"),
            description: `${errorMessage}. ${translate("Please ensure location services are enabled. Using default location.")}`,
            variant: "destructive",
        });
        // Fallback to default location if user denies permission
        onFieldAdd({
            name: name.trim(),
            cropType,
            plantingDate,
            latitude: 25.98,
            longitude: 85.67,
        });
        handleReset();
        setOpen(false);
    } finally {
        setIsGettingLocation(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          {translate("Add New Field")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translate("Add New Field")}</DialogTitle>
          <DialogDescription>
            {translate("Enter the details for your new field. Your browser will ask for location access.")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {translate("Field Name")}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder={translate("e.g., North Paddock")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="crop-type" className="text-right">
              {translate("Crop Type")}
            </Label>
            <Select onValueChange={setCropType} value={cropType}>
                <SelectTrigger id="crop-type" className="col-span-3">
                    <SelectValue placeholder={translate("Select a crop")} />
                </SelectTrigger>
                <SelectContent>
                    {cropTypes.map(crop => (
                        <SelectItem key={crop.value} value={crop.value}>
                            <div className="flex items-center gap-2">
                                <crop.icon className="h-4 w-4 text-muted-foreground" />
                                <span>{translate(crop.label)}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="planting-date" className="text-right">
              {translate("Planting Date")}
            </Label>
             <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !plantingDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {plantingDate ? format(plantingDate, "PPP") : <span>{translate("Pick a date")}</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={plantingDate}
                    onSelect={setPlantingDate}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isGettingLocation}>
            {isGettingLocation && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />}
            {isGettingLocation ? translate('Getting location...') : translate('Add Field')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
