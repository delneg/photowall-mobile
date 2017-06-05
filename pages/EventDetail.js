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
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-root-toast';
import Moment from 'moment';
import 'moment/locale/ru'
import appData from '../app.json'
import {
  Container,
  Button,
  Card,
  CardItem,
  Badge,
  Left,
  Body,
  Content,
  Text,
  Icon,
  Fab,
  Input,
  Item,
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
      photos: [],
      fab_active: false,
      modal_open: false,
      modalCommentInput: '',
      uploadedPhoto: ''
    };
  }

  _fetchNewPhotos() {
    const event_id = this.props.navigation.state.params.event.id;
    fetch(`${appData.serverHost}/api/event/${event_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('Received new photos');
        this.setState({photos: responseJson.image_set});
      })
      .catch((error) => {
        console.log("Error when receiving new photos");
        console.error(error);
      });
  }

  componentDidMount() {
    this._loadInitialState().done();
    this.setState({photos: this.props.navigation.state.params.event.image_set});

    this._fetchNewPhotos();
    setInterval(this._fetchNewPhotos.bind(this), 5000)
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

  uploadClick() {
    let photo = this.state.uploadedPhoto;
    let comment = this.state.modalCommentInput;
    let event_id = this.props.navigation.state.params.event.id;
    let photo_obj = {
      uri: photo.uri,
      type: 'image/jpeg',
      name: Math.random().toString(36).substring(7) + '.jpg',
    };

    let form = new FormData();
    form.append("image", photo_obj);
    form.append('comment', comment);
    form.append('event', event_id);

    fetch(`${appData.serverHost}/image/upload/`, {
        body: form,
        method: "POST",
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Token ' + this.state.token
        }
      }
    ).then((response) => response.json())
      .catch((error) => {
        let toast = Toast.show(`При загрузке фотографии произошла ошибка - ${error}`, {
          duration: Toast.durations.LONG,
          backgroundColor: '#d75452',
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
      })
      .then((responseData) => {
        let message = `Фотография успешно загружена под номером #${responseData.id}.Она появится в галерее после проверки модератором.`;
        let toast = Toast.show(message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#5fb660',
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
        this.setState({modal_open: false})
      }).done();
  }

  showImagePicker() {
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
        let source = {uri: response.uri};
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

          {this.state.photos.map((image, i) => {
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
              {image.comment !== '' &&
              <CardItem>
                <Text>{image.comment}</Text>
              </CardItem>
              }
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
          onOpened={() => this.setState({fab_active: false})}
          onClosed={() => this.setState({modal_open: false})}
        >
          <Button style={{height: 40}}
                  full
                  onPress={() => this.showImagePicker()}>
            <Text>Выбрать фото...</Text>
          </Button>

          {this.state.uploadedPhoto !== '' &&
          <ScrollView>
            <Card style={{marginTop: 0}}>
              <CardItem>
                <Left>
                  <Body>
                  <Text>Сейчас выбрано</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image source={this.state.uploadedPhoto}
                       style={{marginTop: 0, width: width, height: 350}}/>
              </CardItem>
              <CardItem>
                <Item regular>
                  <Input
                    ref={(c) => {
                      this._commentInput = c
                    }}
                    onChangeText={(text) => {
                      this.setState({modalCommentInput: text})
                    }}
                    placeholder='Добавить комментарий'/>
                </Item>

              </CardItem>
              <Button full onPress={this.uploadClick.bind(this)}>
                <Text>Загрузить</Text>
              </Button>
            </Card>
          </ScrollView>
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
          <Button style={{backgroundColor: '#34A34F'}}
                  onPress={() => this.setState({modal_open: !this.state.modal_open})}>
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