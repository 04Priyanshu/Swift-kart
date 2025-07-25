import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Input from "../input";
import { Plus, X } from "lucide-react"; 

const CustomProperties = ({ control, errors }: any) => {

    const [properties,setProperties] = useState<{label:string,value:string[]}[]>([]);
    const [newLabel,setNewLabel] = useState("");
    const [newValue,setNewValue] = useState("");




  return (
      
      <div className="flex flex-col gap-3">
       
            <Controller
              name="customProperties"
              control={control}
              render={({ field }) => {

                useEffect(()=>{
                    field.onChange(properties);
                },[properties])

                const addProperty = ()=>{
                    if(!newLabel.trim()) return;
                    setProperties([...properties,{label:newLabel,value:[]}]);
                    setNewLabel("");
                }
                const addValue = (index:number)=>{
                    if(!newValue.trim()) return;
                    const updatedProperties = [...properties];
                    updatedProperties[index].value.push(newValue);
                    setProperties(updatedProperties);
                    setNewValue("");
                }
                const removeProperty = (index:number)=>{
                    setProperties(properties.filter((_,i)=>i!==index));
                }

                return (
                    <div className="mt-2">
                       <label className="block font-semibold text-gray-300 mb-1">
                        Custom Properties
                       </label>
                       <div className="flex flex-col gap-3">
                        {properties.map((property,index)=>(
                            <div key={index} className="border border-gray-700 rounded-lg p-3 bg-gray-900">
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-medium">
                                        {property.label}
                                    </span>
                                    <button type="button" onClick={()=>removeProperty(index)} className="text-red-500 hover:text-red-700">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <Input type="text" className="border outline-none border-gray-700 rounded-md p-2 bg-gray-900 text-white w-full" placeholder="Enter Value" value={newValue} onChange={(e:any)=>setNewValue(e.target.value)} />
                                    <button type="button" onClick={()=>addValue(index)} className="text-green-500 hover:text-green-700">
                                        <Plus size={18} />Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {property.value.map((value,index)=>(
                                        <span key={index} className=" px-2 py-1 bg-gray-700 rounded-md text-sm text-white">
                                            {value}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 mt-1">
                            <Input className="border outline-none border-gray-700 bg-gray-900 rounded-md p-2  text-white w-full" placeholder="Enter Property label (e.g. Material, Warranty etc.)" value={newLabel} onChange={(e:any)=>setNewLabel(e.target.value)} />
                            <button type="button" onClick={addProperty} className="text-white items-center bg-green-700 cursor-pointer hover:text-green-900 px-3 py-2 flex rounded-md">
                                <Plus size={16} />Add
                            </button>
                        </div>
                    </div>

                    {errors.customProperties && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.customProperties.message as string}
                        </p>
                    )}
                    </div>
                );
            }}
            />
      </div>
  );
};

export default CustomProperties;
