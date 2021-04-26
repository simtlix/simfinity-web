import React, { useContext, useEffect, useState } from "react";
import { Layout, Menu, Typography } from "antd";
import { EventContext, Styled } from "direflow-component";
import PropTypes from "prop-types";
import { requestEntities } from "./utils";
import Table from "./Table/Table";
import styles from "./App.css";

const { Title, Paragraph } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const EntitiesContext = React.createContext();

const App = ({ url }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [entities, setEntities] = useState([]);
  const [currentEntity, setCurrentEntity] = useState(null);
  const [resultTitle, setResultTitle] = useState("");
  const [selectedKey, setSelectedKey] = useState("0");

  useEffect(() => {
    requestEntities(url).then((entities) => {
      if (entities) {
        const filterEmbeddedEntity = entities.filter(
          (entity) => entity?.queryAll
        );
        setEntities(filterEmbeddedEntity);
      }
    });
  }, [url]);

  const dispatch = useContext(EventContext);

  const handleClick = (entity, ind) => {
    setCurrentEntity(entity);
    setResultTitle(`Resultados de ${entity.name}`);
    setSelectedKey(ind.toString());
  };
  const renderEntities = entities.map((entity, index) => (
    <Menu.Item key={index} onClick={() => handleClick(entity, index)}>
      <Paragraph
        style={{
          color: "white",
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >
        {entity.name}
      </Paragraph>
    </Menu.Item>
  ));

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  return (
    <EntitiesContext.Provider value={entities}>
      <Styled styles={styles}>
        <Layout style={{ minHeight: "100vh", display: "flex", flex: "auto" }}>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline">
              {renderEntities}
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: "0 16px" }}>
              <Title level={2} style={{ textAlign: "center" }}>
                {resultTitle}
              </Title>
              <Table displayEntities={currentEntity} />
            </Content>
            <Footer style={{ textAlign: "center" }}>Simtlix ©2021</Footer>
          </Layout>
        </Layout>
      </Styled>
    </EntitiesContext.Provider>
  );
};

App.defaultProps = {
  url: "",
};

App.propTypes = {
  url: PropTypes.string,
};

export default App;
