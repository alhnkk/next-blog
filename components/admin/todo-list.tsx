"use client"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { tr } from 'date-fns/locale'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

const TodoList = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [open, setOpen] = useState(false)
    return (
        <>
            <h1 className="text-lg font-medium mb-6">Yapılacaklar Listesi</h1>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button className="w-full">
                    <CalendarIcon size="16" /> 
                    {date ? format(date, "PPP", { locale: tr }) : <span>Tarih Seç</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto">
                    <Calendar
                        locale={tr}
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                        }}
                        className="rounded-lg border"
                    />
                </PopoverContent>
            </Popover>
            <ScrollArea className="max-h-[400px] mt-4 overflow-y-auto">
               {/* LIST ITEM */}
               <div className="flex flex-col gap-4 pr-4">
                    <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <Checkbox id="item1" />
                                <Label id="item1" className="text-sm text-muted-foreground">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                </Label>
                            </div>
                    </Card>

                    <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <Checkbox id="item1" />
                                <Label id="item1" className="text-sm text-muted-foreground">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                </Label>
                            </div>
                    </Card>

                    <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <Checkbox id="item1" />
                                <Label id="item1" className="text-sm text-muted-foreground">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                </Label>
                            </div>
                    </Card>

                    <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <Checkbox id="item1" />
                                <Label id="item1" className="text-sm text-muted-foreground">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                </Label>
                            </div>
                    </Card>

                    <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <Checkbox id="item1" />
                                <Label id="item1" className="text-sm text-muted-foreground">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                </Label>
                            </div>
                    </Card>

                    <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <Checkbox id="item1" />
                                <Label id="item1" className="text-sm text-muted-foreground">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                </Label>
                            </div>
                    </Card>

                    <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <Checkbox id="item1" />
                                <Label id="item1" className="text-sm text-muted-foreground">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                </Label>
                            </div>
                    </Card>

                    <Card className="p-4">
                            <div className="flex items-center gap-4">
                                <Checkbox id="item1" />
                                <Label id="item1" className="text-sm text-muted-foreground">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                </Label>
                            </div>
                    </Card>
               </div>
            </ScrollArea>
        </>
    )
}

export default TodoList