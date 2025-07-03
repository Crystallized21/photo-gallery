import Image from "next/image";

export default function Home() {
  return (
    <div className="relative h-screen w-full">
      <Image
        alt="thing"
        src={"https://images.unsplash.com/photo-1742853288141-b95880a1c5ea?q=80&w=3275&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}