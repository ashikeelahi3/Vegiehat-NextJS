export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-800 text-gray-800 dark:text-white transition-colors duration-300">
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-vegiehat-primary dark:text-vegiehat-accent">Welcome to VegieHat</h1>
          <p className="text-lg text-vegiehat-secondary dark:text-vegiehat-light mb-12 font-medium">
            Empowering Communities for Fairer Markets
          </p>
            
          <div className="space-y-12">
            <div className="border-l-4 border-vegiehat-primary dark:border-vegiehat-accent pl-6">
              <h2 className="text-2xl font-bold text-vegiehat-primary dark:text-vegiehat-accent mb-4">Why VEGIEHAT?</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                In Bangladesh, unpredictable food prices often create challenges for families trying to make ends meet. Factors like natural disasters, market manipulation, and global supply chain disruptions contribute to these fluctuations. Our mission with VEGIEHAT is to empower communities by providing them with the tools to monitor and report market prices collectively. By doing so, we aim to foster accountability and ensure everyone has access to essential goods at fair prices.
              </p>
            </div>

            <div className="border-l-4 border-vegiehat-primary dark:border-vegiehat-accent pl-6">
              <h2 className="text-2xl font-bold text-vegiehat-primary dark:text-vegiehat-accent mb-4">How Does VEGIEHAT Work?</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VEGIEHAT leverages crowd-sourced data from individuals across the country. With our app, users can easily report real-time market prices, creating a transparent pricing environment. This data is then analysed and shared openly, promoting fairness and enabling consumers to make informed decisions. Our approach is guided by inclusivity, accuracy, and community engagement—values that ensure the platform truly serves the people.        
              </p>
            </div>

            <div className="border-l-4 border-vegiehat-primary dark:border-vegiehat-accent pl-6">
              <h2 className="text-2xl font-bold text-vegiehat-primary dark:text-vegiehat-accent mb-4">What is VEGIEHAT?</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                VEGIEHAT is a digital platform designed to monitor food and vegetable prices in Bangladesh by everyday people. The app provides users with real-time price input capabilities, data visualizations, insights, and alerts for unusual price fluctuations. By joining the VEGIEHAT community, you become part of a movement that transforms markets for the better.
              </p>
            </div>

            <div className="border-l-4 border-vegiehat-primary dark:border-vegiehat-accent pl-6">
              <h2 className="text-2xl font-bold text-vegiehat-primary dark:text-vegiehat-accent mb-4">Get Involved!</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We invite you to signup on the VEGIEHAT today and start contributing price information. Your participation will help create a more equitable food system for everyone. Together, we can make a real difference!
              </p>
            </div>
            
            <div className="flex justify-center pt-4">
              <button className="btn-vegiehat-primary px-6 py-3 text-base">
                Join Our Community
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
