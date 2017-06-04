/**
 * Created by Delneg on 16.03.17.
 */
import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Image,
  WebView,
  Dimensions,
  AsyncStorage
} from 'react-native';
import Modal from 'react-native-modalbox';
import ImagePicker from 'react-native-image-picker'
import Moment from 'moment';
import 'moment/locale/ru'
import appData from '../app.json'
import {
  Container,
  Thumbnail,
  Button,
  Card,
  CardItem,
  Badge,
  List,
  Left,
  Body,
  Right,
  Content,
  ListItem,
  Text,
  Icon,
  Fab,
  Row
} from 'native-base';

const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();
const width = Dimensions.get('window').width;
export default class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false,
      token: '',
      fab_active: false,
      modal_open: false,
      uploadedPhoto: ''
    };
  }

  componentDidMount() {
    this._loadInitialState().done();
  }

  _loadInitialState = async () => {
    try {
      let value = await AsyncStorage.getItem(appData.storageKey);
      if (value !== null) {
        this.setState({logged_in: true, token: value});
        console.log(`Recovered token ${value}`)
      } else {
        console.log("Couldn't recover the token");
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  };

  static navigationOptions = {
    title: ({state}) => `${capitalize(state.params.event.name)}`,
  };


  showImagePicker(){
    let options = {
      title: 'Выберите фотографию для загрузки',
      cancelButtonTitle: 'Отменить',
      takePhotoButtonTitle: 'Сфотографировать..',
      chooseFromLibraryButtonTitle: 'Выбрать из галереи..',
      mediaType: 'photo',
      allowsEditing: true,
      storageOptions: {
        skipBackup: false,
        path: 'images',
        cameraRoll: true
      }
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info below in README)
     */
    ImagePicker.showImagePicker(options, (response) => {
      console.log('User picked an image');

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        let source = { uri: response.uri };
        console.log(source);
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          uploadedPhoto: source
        });
      }
    });
  }
  render() {
    const {navigate} = this.props.navigation;
    const {params} = this.props.navigation.state;
    const styles = {
      hoverText: {
        opacity: 1,
        fontSize: 48,
      },
      listItem: {
        padding: 0,
        margin: 0,
      },
      modal: {
        justifyContent: 'center',
        alignItems: 'center'
      },
    };
    const stylesheet = StyleSheet.create(styles);
    Moment.locale('ru');
    return (
      <Container>
        <Content>


          <Card>
            <CardItem header>
              <Text style={{fontSize: 24, fontWeight: '700'}}>{capitalize(params.event.name)}</Text>
            </CardItem>
            <CardItem>
              <Body>
              <Text>
                {capitalize(params.event.description)}
              </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Badge success><Text>Начало в {Moment(params.event.start_date).format('LLLL')}</Text></Badge>
            </CardItem>
            <CardItem>
              <Badge danger><Text>Конец в {Moment(params.event.end_date).format('LLLL')}</Text></Badge>
            </CardItem>
          </Card>

          {params.event.image_set.map((image, i) => {
            let image_url = `${appData.serverHost}${image.image}`;
            return <Card key={i} style={{flex: 0}}>
              <CardItem>
                <Left>
                  <Body>
                    <Text>{image.uploaded_by.username}</Text>
                    <Text note>{Moment(image.created_at).format('LLLL')}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image style={{height: 200, width: width}} resizeMode='cover' source={{uri: image_url}}/>
              </CardItem>
              <CardItem>
                  {image.published &&
                  <Row>
                    <Icon name="ios-checkmark-circle"/>
                    <Text>Опубликовано</Text>
                  </Row>
                  }
                  {!image.published &&
                  <Row>
                    <Icon name="ios-close-circle"/>
                    <Text>Не опубликовано</Text>
                  </Row>
                  }
              </CardItem>
            </Card>
          })}


        </Content>
        <Modal
          position={"top"}
          isOpen={this.state.modal_open}
          style={stylesheet.modal}
          ref={"modal"}
          swipeToClose={true}
          onOpened={()=> this.setState({fab_active: false})}
          onClosed={() => this.setState({modal_open: false})}
        >
          <Button style={{position:'absolute',top:0,right:0,left:0,height:40}} full onPress={() => this.showImagePicker()}>
            <Text>Выбрать фото...</Text>
          </Button>
          {this.state.uploadedPhoto !== '' &&
          <Card style={{marginTop:45}}>
            <CardItem>
              <Left>
                <Body>
                <Text>Сейчас выбрано</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={this.state.uploadedPhoto} style={{marginTop: 0, width: width, height: 300}}/>
            </CardItem>
          </Card>
          }

        </Modal>
        <Fab
          active={this.state.fab_active}
          direction="up"
          containerStyle={{marginLeft: 10}}
          style={{backgroundColor: '#5067FF'}}
          position="bottomRight"
          onPress={() => this.setState({fab_active: !this.state.fab_active})}>
          <Icon name="list"/>
          {this.state.logged_in &&
          <Button style={{backgroundColor: '#34A34F'}} onPress={() => this.setState({modal_open: !this.state.modal_open})}>
            <Icon name="ios-cloud-upload"/>
          </Button>
          }
          {!this.state.logged_in &&
          <Button style={{backgroundColor: '#157efc'}} onPress={() => navigate('Login')}>
            <Icon name="ios-cloud-upload"/>
          </Button>
          }
        </Fab>
      </Container>
    );
  }
}