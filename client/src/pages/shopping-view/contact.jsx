import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

function ShoppingContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "support@ecommerce.com",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our customer service team",
      contact: "+1 (555) 123-4567",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Facebook,
      title: "Facebook",
      description: "Message us on Facebook for quick support",
      contact: "@EcommerceStore",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      description: "Connect with us professionally on LinkedIn",
      contact: "@EcommerceBusiness",
      color: "text-blue-700",
      bgColor: "bg-blue-50"
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
    { day: "Sunday", hours: "Closed" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-500" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-700" }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              We're here to help! Reach out to us through any of the methods below and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                24/7 Support Available
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Worldwide Service
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            How Can We Help You?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${method.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <method.icon className={`w-8 h-8 ${method.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  <p className={`font-medium ${method.color}`}>{method.contact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Send className="w-6 h-6 text-blue-500" />
                  Send Us a Message
                </CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this regarding?"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Office Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Our Office
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      123 Commerce Street<br />
                      Business District<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Mail className="w-4 h-4" />
                      <span>support@ecommerce.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <Phone className="w-4 h-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">{schedule.day}</span>
                        <span className="font-medium">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                        className={`p-3 bg-gray-100 rounded-lg text-gray-600 ${social.color} transition-colors hover:bg-gray-200`}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Stay connected for the latest updates and exclusive offers!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions. Can't find what you're looking for? Contact us directly!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">How fast is shipping?</h3>
                    <p className="text-gray-600 text-sm">
                      We offer free standard shipping (3-5 business days) and express shipping (1-2 business days) options.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">What's your return policy?</h3>
                    <p className="text-gray-600 text-sm">
                      We offer 30-day returns on most items. Items must be in original condition with tags attached.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Is my payment secure?</h3>
                    <p className="text-gray-600 text-sm">
                      Yes! We use industry-standard SSL encryption to protect your payment information at all times.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Do you ship nationwide?</h3>
                    <p className="text-gray-600 text-sm">
                      Yes, we ship to all states within the country. Shipping rates may vary by location and distance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoppingContact;