import React from "react";
import { Card, Collapse, Typography, Select , Spin  } from "antd";
import "../App.css"; 

const { Panel } = Collapse;
const { Title } = Typography;
const { Option } = Select;

const FAQList = ({ faqs = [], language, onLanguageChange , loading }) => {
  return (
    <Card className="faq-card">
      <div style={{ marginBottom: "16px", textAlign: "right" }}>
        <Select
          defaultValue={language}
          style={{ width: 120 }}
          onChange={onLanguageChange}
        >
          <Option value="en">English</Option>
          <Option value="es">Spanish</Option>
          <Option value="fr">French</Option>
          <Option value="hi">Hindi</Option>
          <Option value="ta">Tamil</Option>
          <Option value="te">Telugu</Option>
          <Option value="kn">Kannada</Option>
          <Option value="ml">Malayalam</Option>
          <Option value="bn">Bengali</Option>
          <Option value="mr">Marathi</Option>
          <Option value="gu">Gujarati</Option>
          <Option value="pa">Punjabi</Option>
        </Select>
      </div>

   
      <Spin spinning={loading}>
        <Collapse accordion>
          {faqs.map((faq) => (
            <Panel header={faq.question} key={faq.id} className="faq-panel">
              <div className="faq-answer">
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </div>
            </Panel>
          ))}
        </Collapse>
      </Spin>
    </Card>
  );
};

export default FAQList;