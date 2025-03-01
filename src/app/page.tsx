import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-9">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">VEGIEHAT</h1>
        <p className="text-lg text-gray-700 mb-8">
          <span className="font-bold">VEGIEHAT:</span> Empowering Communities for Fairer Markets through voluntary participation.
        </p>
          
        <h1 className="text-xl font-bold text-gray-900 mb-4">Why VEGIEHAT?</h1>
        <p className="text-lg text-gray-700 mb-8">
        In Bangladesh, unpredictable food prices often create challenges for families trying to make ends meet. Factors like natural disasters, market manipulation, and global supply chain disruptions contribute to these fluctuations. Our mission with VEGIEHAT is to empower communities by providing them with the tools to monitor and report market prices collectively. By doing so, we aim to foster accountability and ensure everyone has access to essential goods at fair prices.
        </p>

        <h1 className="text-xl font-bold text-gray-900 mb-4">How Does VEGIEHAT Work?</h1>
        <p className="text-lg text-gray-700 mb-8">
          VEGIEHAT leverages crowd-sourced data from individuals across the country. With our app, users can easily report real-time market prices, creating a transparent pricing environment. This data is then analysed and shared openly, promoting fairness and enabling consumers to make informed decisions. Our approach is guided by inclusivity, accuracy, and community engagement—values that ensure the platform truly serves the people.        
        </p>

        <h1 className="text-xl font-bold text-gray-900 mb-4">What is VEGIEHAT?</h1>
        <p className="text-lg text-gray-700 mb-8">
          VEGIEHAT is a digital platform designed to monitor food and vegetable prices in Bangladesh by everyday people. The app provides users with real-time price input capabilities, data visualizations, insights, and alerts for unusual price fluctuations. By joining the VEGIEHAT community, you become part of a movement that transforms markets for the better.
        </p>

        <h1 className="text-xl font-bold text-gray-900 mb-4">Get Involved!        </h1>
        <p className="text-lg text-gray-700 mb-8">
          We invite you to signup on the VEGIEHAT today and start contributing price information. Your participation will help create a more equitable food system for everyone. Together, we can make a real difference!
        </p>
      </div>
    </div>
  );
}
