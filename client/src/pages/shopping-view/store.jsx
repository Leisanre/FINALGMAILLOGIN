import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail,
  Navigation,
  Store as StoreIcon,
  Users,
  Car,
  Wifi,
  CreditCard,
  ShoppingBag,
  Star
} from "lucide-react";

function ShoppingStore() {
  const branches = [
    {
      id: 1,
      name: "BookSale Manila Main",
      type: "Main Store",
      address: "456 Rizal Avenue, Manila, Philippines 1000",
      phone: "+63 (2) 8123-4567",
      email: "manila@booksale.com",
      hours: {
        weekdays: "9:00 AM - 9:00 PM",
        saturday: "9:00 AM - 10:00 PM",
        sunday: "10:00 AM - 8:00 PM"
      },
      rating: 4.8,
      image: "/api/placeholder/400/250",
      isOpen: true
    },
    {
      id: 2,
      name: "BookSale Quezon City",
      type: "Branch Store",
      address: "789 Commonwealth Avenue, Quezon City, Philippines 1100",
      phone: "+63 (2) 8234-5678",
      email: "qc@booksale.com",
      hours: {
        weekdays: "10:00 AM - 9:00 PM",
        saturday: "10:00 AM - 10:00 PM",
        sunday: "11:00 AM - 7:00 PM"
      },
      rating: 4.6,
      image: "/api/placeholder/400/250",
      isOpen: true
    },
    {
      id: 3,
      name: "BookSale Makati",
      type: "Express Store",
      address: "321 Ayala Avenue, Makati City, Philippines 1200",
      phone: "+63 (2) 8345-6789",
      email: "makati@booksale.com",
      hours: {
        weekdays: "8:00 AM - 8:00 PM",
        saturday: "9:00 AM - 9:00 PM",
        sunday: "10:00 AM - 6:00 PM"
      },
      rating: 4.4,
      image: "/api/placeholder/400/250",
      isOpen: true
    },
    {
      id: 4,
      name: "BookSale Cebu",
      type: "Regional Store",
      address: "654 Colon Street, Cebu City, Philippines 6000",
      phone: "+63 (32) 456-7890",
      email: "cebu@booksale.com",
      hours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "10:00 AM - 9:00 PM",
        sunday: "11:00 AM - 6:00 PM"
      },
      rating: 4.7,
      image: "/api/placeholder/400/250",
      isOpen: true
    }
  ];

  const storeStats = [
    { icon: StoreIcon, label: "BookSale Stores", value: "4", color: "text-blue-500" },
    { icon: Users, label: "Book Lovers Served", value: "50K+", color: "text-green-500" },
    { icon: MapPin, label: "Cities", value: "4", color: "text-purple-500" },
    { icon: ShoppingBag, label: "Books Sold Daily", value: "1,500+", color: "text-orange-500" }
  ];

  const getStoreTypeColor = (type) => {
    switch (type) {
      case "Main Store": return "bg-blue-600 text-white";
      case "Branch Store": return "bg-blue-100 text-blue-800";
      case "Express Store": return "bg-green-100 text-green-800";
      case "Regional Store": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              BookSale Store Locations
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Visit our bookstores to browse thousands of books, get personalized recommendations from our
              book experts, and discover your next great read in a cozy reading environment.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Extended Reading Hours
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Navigation className="w-4 h-4 mr-2" />
                Book Expert Assistance
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Store Statistics */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {storeStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <stat.icon className={`w-8 h-8 md:w-10 md:h-10 mx-auto mb-4 ${stat.color}`} />
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

      {/* Store Locations */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Find a BookSale Store Near You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each BookSale store offers a carefully curated selection of books, comfortable reading
              spaces, and knowledgeable staff ready to help you discover your next favorite book.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {branches.map((branch) => (
              <Card key={branch.id} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
                {/* Store Image */}
                <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className={getStoreTypeColor(branch.type)}>
                      {branch.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant={branch.isOpen ? "default" : "destructive"}>
                      {branch.isOpen ? "Open" : "Temporarily Closed"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{branch.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{branch.rating}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-1">
                  {/* Address and Contact */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 leading-relaxed">{branch.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">{branch.email}</span>
                    </div>
                  </div>

                  {/* Store Hours */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Store Hours
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Monday - Friday:</span>
                        <span className="font-medium">{branch.hours.weekdays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday:</span>
                        <span className="font-medium">{branch.hours.saturday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday:</span>
                        <span className="font-medium">{branch.hours.sunday}</span>
                      </div>
                    </div>
                  </div>




                  {/* Action Button */}
                  <div className="mt-auto">
                    <Button
                      className="w-full"
                      disabled={!branch.isOpen}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us CTA */}
      <section className="py-12 md:py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Visit BookSale Today
            </h2>
            <p className="text-lg md:text-xl leading-relaxed opacity-90 mb-8">
              Discover thousands of books, get personalized recommendations from our book experts,
              and enjoy the cozy atmosphere of reading in our comfortable bookstore spaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <MapPin className="w-5 h-5 mr-2" />
                Find Nearest BookSale
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Books Online
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoppingStore;