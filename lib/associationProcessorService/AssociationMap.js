'use strict';
const _ = require('lodash');
const Promise = require('bluebird');

function AssociationList(name, associations, components){

    let associationList = {};

    function evaluateNestedAssociations(definition, ctx, request) {

        let nestedList;

        if (_.isEmpty(definition.associations)) {
            return Promise.resolve({});
        } else {
            nestedList = AssociationMap(definition.associations, components);
            return nestedList.render(ctx, request);
        }

    }

    function renderOneComponent(definition, ctx, req){
        return evaluateNestedAssociations(definition, ctx, req).then(function (nestedResults) {
            let component = components.getComponent(definition.component);

            definition.associations = nestedResults;

            return component.render(definition, ctx, req, name, definition.component);
        });
    }

    function evaluateArray(ctx, req) {
        let componentPromises = [];

        associations.forEach(function (definintion) {
            componentPromises.push(renderOneComponent(definintion, ctx, req, components));
        });

        return Promise.all(componentPromises);
    }

    associationList.render = function render(ctx, req){
        return evaluateArray(ctx, req).then(function (components) {

            let markup = [];
            let exported = {};

            components.forEach(function (component) {
                _.merge(exported, component.exported || {});
                markup.push(component.markup);
            });

            return {
                markup: markup.join("\n"),
                exported
            };

        });
    };

    return associationList;
}

function AssociationMap(associations, components) {

    let associationMap = {};

    function renderNamedAssociation(ctx, req, definitions, name){

        let associationList = AssociationList(name, definitions, components);
        return associationList.render(ctx, req);

    }

    associationMap.render = function (ctx, req) {
        let exported = {};
        let associationResults = {};
        let associationPromises = [];

        _.forIn(associations, function (definitions, name) {

            let promise = renderNamedAssociation(ctx, req, definitions, name).then(function (components) {
                associationResults[name] = components.markup;
                _.merge(exported, components.exported);
            });

            associationPromises.push(promise);
        });

        return Promise.all(associationPromises).then(function () {
            return {
                exported,
                markup: associationResults
            };
        });
    };

    return associationMap;
}

module.exports = AssociationMap;
