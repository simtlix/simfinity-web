import React, { useContext, useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { EventContext, Styled } from "direflow-component";
import PropTypes from "prop-types";
import { requestEntities } from "./utils";
import Table from "./Table/Table";
import styles from "./App.css";

const App = (props) => {
  const { Header, Content, Footer, Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);

  const EntitiesContext = React.createContext();

  const [entities, setEntities] = useState([]);
  const [currentEntities, setCurrentEntities] = useState("");

  useEffect(() => {
    requestEntities(props.url).then((entities) => {
      if (entities) {
        setEntities(entities);
      }
    });
  }, [props.url]);

  const dispatch = useContext(EventContext);

  const handleClick = (entity) => {
    setCurrentEntities(entity);
  };

  const renderEntities = entities.map((entity, index) => (
    <Menu.Item key={index} onClick={() => handleClick(entity)}>
      {entity.name}
    </Menu.Item>
  ));

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  return (
    <EntitiesContext.Provider value={entities}>
      <Styled styles={styles}>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Menu theme="dark" defaultSelectedKeys={["0"]} mode="inline">
              {renderEntities}
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: "0 16px" }}>
              <h1>Welcome!</h1>
              <Table displayEntities={currentEntities} />
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
  componentTitle: "Simfinity Web",
  sampleList: [
    "Create with React",
    "Build as Web Component",
    "Use it anywhere!",
  ],
};

App.propTypes = {
  url: PropTypes.string,
  componentTitle: PropTypes.string,
  sampleList: PropTypes.array,
};

export default App;
