import React, { useState } from "react";
import { Card, Input, Button, Form } from "antd";
import JoditEditor from "jodit-react";
import "../App.css";

const AddFAQ = ({ onAddFAQ }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!question || !answer) {
      alert("Please fill in both the question and answer.");
      return;
    }
    onAddFAQ({ question, answer });
    setQuestion("");
    setAnswer("");
  };
  return (
    <Card className="add-faq-card">
      <Form layout="vertical">
       
        <Form.Item label="Question" required>
          <Input
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ borderRadius: "6px" }}
            size="large"
          />
        </Form.Item>
        <Form.Item label="Answer" required>
          <JoditEditor
            value={answer}
            onChange={(newContent) => setAnswer(newContent)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{
              width: "100%",
              height: "40px",
              fontSize: "16px",
              borderRadius: "6px",
            }}
          >
            Add FAQ
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddFAQ;