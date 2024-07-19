"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { getCookie } from 'cookies-next';
import Link from "next/link";

export default function Home() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchData = async () => {

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/active_users`,{
        credentials: "include"});
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const fetchedData = await response.json();
      const parsedData = JSON.parse(fetchedData);
      setUsers(parsedData);
      console.log(parsedData, typeof parsedData)
    } catch (err) {
      
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isLoading ? (
        <div>Loading users...</div>
      ) : (
        users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <Link href={`/${user}`}>
                <li key={user} className="py-2 m-4 px-4 bg-slate-400 rounded-lg min-w-[20vh]">
                  {user} {/* Render user properties as needed */}
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <div>No active users found.</div>
        )
      )}
    </main>
  );
}
