/**
 * Created by Delneg on 16.03.17.
 */
import React, {Component} from 'react';
import {Container, Content, Left, Body, Right, ListItem, Thumbnail, Text} from 'native-base';
import {
  StyleSheet,
  Button
} from 'react-native';
export default class EventListItem extends Component {


  render() {
    return (
      <Container>
        <Content>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square size={80} source={'http://www.jobfair.ru/files/Proekt_Obschefederalniyi/Job_news/2014/q1/image500333.gif'}/>
            </Left>
            <Body>
            <Text>Sankhadeep</Text>
            <Text note>Its time to build a difference . .</Text>
            </Body>
            <Right>
              <Button transparent>
                <Text>View</Text>
              </Button>
            </Right>
          </ListItem>
        </Content>
      </Container>
    );
  }
}