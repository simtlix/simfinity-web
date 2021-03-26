import React, { useContext, useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { EventContext, Styled } from "direflow-component";
import PropTypes from "prop-types";
import { requestEntities } from "./utils";
import TableOfEntities from "./Table";
import styles from "./App.css";

const App = (props) => {
  const { Header, Content, Footer, Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);

  const EntitiesContext = React.createContext();
  const [entities, setEntities] = useState();

  useEffect(() => {
    requestEntities(props.url).then((entities) => {
      if (entities) {
        setEntities(entities);
      }
    });
  }, [props.url]);

  const dispatch = useContext(EventContext);

  const handleClick = () => {
    const event = new Event("my-event");
    dispatch(event);
  };

  const renderSampleList = props.sampleList.map((sample) => (
    <div key={sample} className="sample-text">
      → {sample}
    </div>
  ));

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  return (
    <EntitiesContext.Provider value={entities}>
      <Styled styles={styles}>
        {/* <div>{renderSampleList}</div>
        <button className="button" onClick={handleClick}>
          Click me!
        </button> */}
        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
              <Menu.Item key="1">Entidades</Menu.Item>
              <Menu.Item key="2">Option 1</Menu.Item>
              <Menu.Item key="3">Option 2</Menu.Item>
              <Menu.Item key="9">Files</Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: "0 16px" }}>
              <h1>Welcome!</h1>
              <TableOfEntities />
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
