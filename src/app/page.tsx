// import Image from "next/image";
"use client"

function test() {
  alert('hello world');
}

export default function Home() {

  return (
    <main className="min-h-screen font-mono bg-slate-800 grid grid-cols-1 place-content-center px-64">
      <section className="titleTop">
        <p className="text-center text-2xl font-bold mb-10">QR SCANNER</p>
      </section>
      <section className="grid grid-cols-2 gap-5">
        <section className="flex justify-center">
          <picture>
            <img className="border-2 w-96 h-96 rounded-sm bg-white" src="" alt="ph" />
          </picture>
        </section>
        <section>
          <div onClick={test} className="cursor-pointer uploadFromFile border-2 rounded-sm capitalize text-center mb-10">Upload from file</div>
          <div className="readedQr border-2 rounded-sm px-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo omnis delectus vitae autem, accusamus repellat rerum, explicabo molestias consectetur nisi debitis, iure quod obcaecati. Unde, tempore quidem eos quis, voluptate repellendus distinctio quam repudiandae officia quo enim, ratione nobis quibusdam error quia consequatur quod eligendi. Laudantium quos explicabo nulla atque?</div>
        </section>
      </section>
    </main>
  );
}
