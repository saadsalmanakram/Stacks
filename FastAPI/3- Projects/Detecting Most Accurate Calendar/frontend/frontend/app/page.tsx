import Header from "../components/Header";  
import Footer from "../components/Footer"; 

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-6">
        <section className="prose max-w-none">
          {/* Your content goes here */}
        </section>
      </main>

      <Footer />
    </div>
  );
}