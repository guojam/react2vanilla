import React from 'react';
import ReactDOM from 'react-dom/client';

class ExportVanillaComponent {
    constructor(Comp, node, params = {}) {
        this.compRef = React.createRef();
        this.node = node;
        this.ExportComponent = exportComponent(Comp);
        this.init(params);
    }

    init = (params) => {
        const { created, ...rest } = params;
        // React17-
        // this.inst = ReactDOM.render(
        //     <this.ExportComponent {...rest} />,
        //     this.node,
        //     () => {
        //         created && created.call(this);
        //     }
        // );

        this.root = ReactDOM.createRoot(this.node);
        this.root.render(<this.ExportComponent ref={this.compRef} {...rest} />);
        window.requestIdleCallback(() => {
            created && created.call(this);
        });
    };

    update = (data, callback) => {
        const inst = this.compRef.current;
        if (inst && inst.update) {
            inst.update(data, () => {
                callback && callback.call(this);
            });
        }
    };

    destroy = (callback) => {
        // React17-
        //     const result = ReactDOM.unmountComponentAtNode(this.node);
        //     if (result) {
        //         this.inst = null;
        //         callback && callback.call(this);
        //     }
        this.root.unmount();
        this.inst = null;
        callback && callback.call(this);
    };
}

/** HOC：React组件附件更新方法 */
function exportComponent(WrappedComponent) {
    return class ExportComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = { ...props };
        }

        update = (params, callback) => {
            this.setState({ ...this.state, ...params }, callback);
        };

        render() {
            return <WrappedComponent {...this.state} />;
        }
    };
}

function exportCompFactory(Comp, CompName = Comp.displayName) {
    const funcName = `create${CompName}`;
    const exportedMethod = function (node, params) {
        return new ExportVanillaComponent(Comp, node, params);
    };

    window[funcName] = exportedMethod;
    return exportedMethod;
}

export { exportCompFactory };
