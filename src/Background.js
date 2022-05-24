function Background({ src }) {
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