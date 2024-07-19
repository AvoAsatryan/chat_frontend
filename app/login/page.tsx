"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { setCookie, getCookie } from 'cookies-next';
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter()
    const [userInput, setUserInput] = useState<string>('');
    const [data, setData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
      };

    const fetchData = async () => {
        setIsLoading(true);
    
        try {
          const response = await fetch(`http://localhost:8000/token?username=${userInput}`);
          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
          }
          const fetchedData = await response.json();
          setCookie('access_token', fetchedData);
          setCookie('username', userInput);
          setData(fetchedData);
          router.push('/')
        } catch (err) {
          
        } finally {
          setIsLoading(false);
        }
      };

    const handleClick = async () => {
        if (!userInput) {
          return;
        }
        await fetchData();
    };

    useEffect(() => {
        // Clear data and error if user input changes
        console.log(userInput)
        setData(null);
      }, [userInput]);
    return (
      <div className="flex max-w-[50vh] items-center justify-center">
         <Input type="text" onChange={handleInputChange} placeholder="Enter your username"/>
         <Button onClick={handleClick}>Enter</Button>
      </div>
      
    );
  }