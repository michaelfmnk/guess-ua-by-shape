import _ from 'lodash';

const src = require(`./assets/bg${_.random(1, 6)}.jpg`)
function Background() {
    return (
        <div style={{
            zIndex: -1,
            position: 'absolute',
            height: '100vh',
            width: '100vw',
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
        }} />
    )
}
export default Background;