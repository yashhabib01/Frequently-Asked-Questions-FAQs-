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
    
    try {
      setLoading(true);
      await axios.post(`${serverUrl}/faqs`, {question: newFAQ.question, answer: newFAQ.answer});
      setFaqs([...faqs, { id: newId, ...newFAQ }]);
      fetchFAQS("en");
    } catch (error) {
      console.log("Error adding FAQ:", error);
    } finally {
      setLanguage("en")
      setLoading(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (value) => {
    setLanguage(value);
    
  };

  const  fetchFAQS =  async  (lang)  => {

    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/faqs?lang=${lang ? lang :  language}`);
      if(response.status === 200){        
       setFaqs(response.data);
     }
      
    } catch (error) {
      console.log("Error fetching FAQs:", error);
    }finally{
      setLoading(false);
    }
  }

  const onDeleteFAQ = async(id) => {
    
    try {
      setLoading(true);
      await axios.delete(`${serverUrl}/faqs/${id}`);
      setFaqs(faqs.filter(faq => faq.id !== id));
      fetchFAQS("en");
    } catch (error) {
      setLoading(false);
      console.log("Error deleting FAQ:", error);
    }finally{
      setLanguage("en")
      setLoading(false);
    }
    
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
        onDeleteFAQ={onDeleteFAQ}
      />
      </div>
    </div>
  );
};

export default App;