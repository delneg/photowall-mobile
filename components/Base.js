/**
 * Created by Delneg on 04.06.17.
 */
import React, { Component } from 'react';
import { Container, Content, ListItem, Text, CheckBox, Header } from 'native-base';
export default class Base extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
          <Title>Header</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
          <Content>
            {this.props.children}
          </Content>
      </Container>
    );
  }
}