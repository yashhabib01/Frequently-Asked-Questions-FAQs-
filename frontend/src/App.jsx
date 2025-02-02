import React, { useEffect, useState } from "react";
import { Typography } from "antd";
import FAQList from "./components/FAQList";
import AddFAQ from "./components/AddFAQ";
import "./App.css"; 
import axios from "axios";
const serverUrl =  import.meta.env.VITE_APP_SERVER_URL;

const { Title } = Typography;


const App = () => {
  const [faqs, setFaqs] = useState([]);

  const [language, setLanguage] = useState("en"); 
  const [loading, setLoading] = useState(false);
  // Handle adding a new FAQ
  const handleAddFAQ = async (newFAQ) => {
    const newId = faqs.length + 1; // Generate a new ID
    setFaqs([...faqs, { id: newId, ...newFAQ }]);
    setLanguage("en");
    try {
      await axios.post(`${serverUrl}/faqs`, {question: newFAQ.question, answer: newFAQ.answer});
        
      fetchFAQS()
    } catch (error) {
      console.log("Error adding FAQ:", error);
    }
  };

  // Handle language change
  const handleLanguageChange = (value) => {
    setLanguage(value);
    
  };

  const  fetchFAQS =  async  ()  => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/faqs?lang=${language}`);
      if(response.status === 200){        
       setFaqs(response.data);
     }
      console.log(response.data)
    } catch (error) {
      console.log("Error fetching FAQs:", error);
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchFAQS();
  },  [language])

  return (
    <div>
      <Title level={2} style={{ textAlign: "center", marginBottom: "10px" }}>
        Frequently Asked Questions (FAQs)
      </Title>

      <div className="faq-container">
      <AddFAQ onAddFAQ={handleAddFAQ} />
      <FAQList
        faqs={faqs}
        language={language}
        onLanguageChange={handleLanguageChange}
        loading={loading}
      />
      </div>
    </div>
  );
};

export default App;