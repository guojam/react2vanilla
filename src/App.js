function App(props) {
    return (
        <div>
            <div style={{ textAlign: 'center' }}>App Component</div>
            {props.children}
        </div>
    );
}
App.displayName = 'App';

export default App;
