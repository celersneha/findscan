import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  BollingerBandsSettings,
  DEFAULT_BOLLINGER_SETTINGS,
  SourceType,
  MAType,
  LineStyle,
} from "../lib/types";

interface BollingerSettingsProps {
  settings: BollingerBandsSettings;
  onChange: (settings: BollingerBandsSettings) => void;
  onClose: () => void;
}

function BollingerSettings({
  settings,
  onChange,
  onClose,
}: BollingerSettingsProps) {
  const [activeTab, setActiveTab] = useState<"inputs" | "style">("inputs");

  const updateSettings = (updates: Partial<BollingerBandsSettings>) => {
    onChange({ ...settings, ...updates });
  };

  const updateBandSettings = (
    band: "basicBand" | "upperBand" | "lowerBand",
    updates: Partial<BollingerBandsSettings["basicBand"]>
  ) => {
    onChange({
      ...settings,
      [band]: { ...settings[band], ...updates },
    });
  };

  const updateBackgroundFill = (
    updates: Partial<BollingerBandsSettings["backgroundFill"]>
  ) => {
    onChange({
      ...settings,
      backgroundFill: { ...settings.backgroundFill, ...updates },
    });
  };

  const resetToDefaults = () => {
    onChange(DEFAULT_BOLLINGER_SETTINGS);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col flex-1 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bollinger Bands Settings</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "inputs" | "style")}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          <TabsContent
            value="inputs"
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            <div>
              <Label htmlFor="length" className="text-sm font-medium mb-1">
                Length
              </Label>
              <Input
                id="length"
                type="number"
                value={settings.length}
                onChange={(e) =>
                  updateSettings({ length: parseInt(e.target.value) || 20 })
                }
                min="1"
                max="200"
              />
            </div>

            <div>
              <Label htmlFor="basicMAType" className="text-sm font-medium mb-1">
                Basic MA Type
              </Label>
              <Select
                value={settings.basicMAType}
                onValueChange={(value) =>
                  updateSettings({ basicMAType: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMA">SMA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source" className="text-sm font-medium mb-1">
                Source
              </Label>
              <Select
                value={settings.source}
                onValueChange={(value) =>
                  updateSettings({ source: value as SourceType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="close">Close</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stdDev" className="text-sm font-medium mb-1">
                StdDev (multiplier)
              </Label>
              <Input
                id="stdDev"
                type="number"
                value={settings.stdDevMultiplier}
                onChange={(e) =>
                  updateSettings({
                    stdDevMultiplier: parseFloat(e.target.value) || 2,
                  })
                }
                step="0.1"
                min="0.1"
                max="5"
              />
            </div>

            <div>
              <Label htmlFor="offset" className="text-sm font-medium mb-1">
                Offset
              </Label>
              <Input
                id="offset"
                type="number"
                value={settings.offset}
                onChange={(e) =>
                  updateSettings({ offset: parseInt(e.target.value) || 0 })
                }
                min="-50"
                max="50"
              />
            </div>
          </TabsContent>

          <TabsContent
            value="style"
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            <div>
              <h3 className="text-sm font-medium mb-3">Basic (Middle Band)</h3>
              <div className="space-y-3 pl-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="basicBand-visible"
                    checked={settings.basicBand.visible}
                    onCheckedChange={(checked) =>
                      updateBandSettings("basicBand", {
                        visible: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="basicBand-visible" className="text-sm">
                    Visible
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.basicBand.color}
                    onChange={(e) =>
                      updateBandSettings("basicBand", {
                        color: e.target.value,
                      })
                    }
                    className="w-8 h-8 rounded border border-gray-300"
                  />
                  <Label className="text-sm">Color</Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Slider
                    value={[settings.basicBand.lineWidth]}
                    onValueChange={(value) =>
                      updateBandSettings("basicBand", {
                        lineWidth: value[0],
                      })
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-12">
                    {settings.basicBand.lineWidth}px
                  </span>
                </div>

                <Select
                  value={settings.basicBand.lineStyle}
                  onValueChange={(value) =>
                    updateBandSettings("basicBand", {
                      lineStyle: value as any,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Upper Band</h3>
              <div className="space-y-3 pl-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="upperBand-visible"
                    checked={settings.upperBand.visible}
                    onCheckedChange={(checked) =>
                      updateBandSettings("upperBand", {
                        visible: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="upperBand-visible" className="text-sm">
                    Visible
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.upperBand.color}
                    onChange={(e) =>
                      updateBandSettings("upperBand", {
                        color: e.target.value,
                      })
                    }
                    className="w-8 h-8 rounded border border-gray-300"
                  />
                  <Label className="text-sm">Color</Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Slider
                    value={[settings.upperBand.lineWidth]}
                    onValueChange={(value) =>
                      updateBandSettings("upperBand", {
                        lineWidth: value[0],
                      })
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-12">
                    {settings.upperBand.lineWidth}px
                  </span>
                </div>

                <Select
                  value={settings.upperBand.lineStyle}
                  onValueChange={(value) =>
                    updateBandSettings("upperBand", {
                      lineStyle: value as any,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Lower Band</h3>
              <div className="space-y-3 pl-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="lowerBand-visible"
                    checked={settings.lowerBand.visible}
                    onCheckedChange={(checked) =>
                      updateBandSettings("lowerBand", {
                        visible: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="lowerBand-visible" className="text-sm">
                    Visible
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.lowerBand.color}
                    onChange={(e) =>
                      updateBandSettings("lowerBand", {
                        color: e.target.value,
                      })
                    }
                    className="w-8 h-8 rounded border border-gray-300"
                  />
                  <Label className="text-sm">Color</Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Slider
                    value={[settings.lowerBand.lineWidth]}
                    onValueChange={(value) =>
                      updateBandSettings("lowerBand", {
                        lineWidth: value[0],
                      })
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-12">
                    {settings.lowerBand.lineWidth}px
                  </span>
                </div>

                <Select
                  value={settings.lowerBand.lineStyle}
                  onValueChange={(value) =>
                    updateBandSettings("lowerBand", {
                      lineStyle: value as any,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Background Fill</h3>
              <div className="space-y-3 pl-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="backgroundFill-visible"
                    checked={settings.backgroundFill.visible}
                    onCheckedChange={(checked) =>
                      updateBackgroundFill({
                        visible: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="backgroundFill-visible" className="text-sm">
                    Visible
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Slider
                    value={[settings.backgroundFill.opacity]}
                    onValueChange={(value) =>
                      updateBackgroundFill({
                        opacity: value[0],
                      })
                    }
                    min={0}
                    max={1}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm w-12">
                    {Math.round(settings.backgroundFill.opacity * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BollingerSettings;
