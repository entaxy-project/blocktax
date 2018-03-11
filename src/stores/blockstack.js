import {observable, computed, action, extendObservable} from 'mobx';
import {redirectToSignIn, handlePendingSignIn, signUserOut, isUserSignedIn, loadUserData, Person} from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class BlockstackStore {
  @observable
  signedIn = false

  profile = null

  constructor(router) {
    this.router = router;

    if (isUserSignedIn()) {
      this.fetchUserData();
    }
  }

  @computed
  get name() {
    return (this.profile && this.profile.name()) || 'Nameless Person';
  }

  @computed
  get avatar() {
    return (this.profile && this.profile.avatarUrl()) || avatarFallbackImage;
  }

  async signIn() {
    redirectToSignIn();
    await handlePendingSignIn();
    this.fetchUserData();
  }

  signOut = () => {
    this.router.push('/');
    signUserOut();
    extendObservable(this, {
      user: {}
    });
  }

  @action
  fetchUserData() {
    this.profile = new Person(loadUserData().profile);
    this.signedIn = true;
  }
}
