import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingBag, 
  Users, 
  Globe, 
  Heart,
  Star,
  Shield,
  Truck,
  Headphones
} from "lucide-react";

function ShoppingAbout() {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "50,000+" },
    { icon: ShoppingBag, label: "Products Sold", value: "100,000+" },
    { icon: Globe, label: "Countries Served", value: "25+" },
    { icon: Star, label: "Average Rating", value: "4.8/5" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Your payment information is always safe and secure with our advanced encryption technology."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get your orders delivered quickly with our efficient shipping network and tracking system."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our customer service team is always ready to help you with any questions or concerns."
    },
    {
      icon: Heart,
      title: "Quality Products",
      description: "We carefully curate our product selection to ensure the highest quality for our customers."
    }
  ];

  const values = [
    {
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above everything else, ensuring every interaction exceeds expectations."
    },
    {
      title: "Quality Assurance",
      description: "Every product in our store goes through rigorous quality checks to ensure you receive only the best."
    },
    {
      title: "Innovation",
      description: "We constantly evolve our platform and services to provide you with the latest in e-commerce technology."
    },
    {
      title: "Sustainability",
      description: "We're committed to environmentally responsible practices in our operations and product sourcing."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20" style={{backgroundColor: '#126c1b'}}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              About Our Store
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 leading-relaxed">
              We're passionate about bringing you the best shopping experience with carefully selected products,
              exceptional customer service, and innovative solutions that make your life better.
            </p>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Established 1980
            </Badge>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4 text-primary" />
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-16" style={{backgroundColor: '#E8E8E6'}}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-800 space-y-6">
              <p className="text-lg leading-relaxed text-gray-800">
                Founded in 2020, our e-commerce platform began with a simple mission: to make quality products 
                accessible to everyone, everywhere. What started as a small team of passionate entrepreneurs has 
                grown into a thriving community of satisfied customers across the globe.
              </p>
              <p className="text-lg leading-relaxed text-gray-800">
                We believe that shopping should be more than just a transaction—it should be an experience. 
                That's why we've built our platform around the principles of trust, quality, and exceptional 
                customer service. Every product we offer is carefully selected, and every customer interaction 
                is an opportunity to exceed expectations.
              </p>
              <p className="text-lg leading-relaxed text-gray-800">
                Today, we're proud to serve thousands of customers worldwide, offering everything from the latest 
                fashion trends to innovative technology solutions. Our commitment to excellence drives us to 
                continuously improve and expand our offerings while maintaining the personal touch that sets us apart.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <feature.icon className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Our Mission
            </h2>
            <p className="text-lg md:text-xl leading-relaxed opacity-90">
              To create exceptional shopping experiences that connect people with products they love, 
              while building a sustainable and inclusive marketplace that benefits customers, partners, 
              and communities worldwide.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default ShoppingAbout;