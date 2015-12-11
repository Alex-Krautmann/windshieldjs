"use strict";


describe("renderer", function () {
    xit("should be a function", function () {
        expect(renderer).toEqual(jasmine.any(Function));
    });

    xit("should return a function which takes a page object and then calls reply.view once with a layout path and the given page object", function (done) {
        spyOn(internals, 'cachedFilePromise').and.returnValue(mocks.filePromise);
        spyOn(mocks.reply, 'view').and.callThrough();
        renderer.call(mocks.windshieldCallContext, mocks.reply)(mocks.page).then(function (){
            expect(mocks.reply.view.calls.count()).toEqual(1);
            expect(mocks.reply.view).toHaveBeenCalledWith('layouts/' + mocks.page.layout, mocks.page);
            done();
        });
    });

    xit("should use the notFound template for any component that is not found", function (done) {
        spyOn(internals, 'cachedFilePromise').and.returnValue(mocks.filePromise);
        renderer.call(mocks.windshieldCallContext, mocks.reply)(mocks.page).then(function (){
            expect(internals.cachedFilePromise).toHaveBeenCalledWith(path.join(__dirname, 'notFound.html'), 'utf-8');
            done();
        });
    });

    xit("should log error when using the default notFound template", function (done) {
        spyOn(mocks.windshieldCallContext.server, 'log');
        renderer.call(mocks.windshieldCallContext, mocks.reply)(mocks.page).then(function (){
            expect(mocks.windshieldCallContext.server.log).toHaveBeenCalledWith('component template not found. falling back to notFound.html', jasmine.any(Object));
            done();
        });
    });

    xit("should use component path from paths map when it exists", function (done) {
        spyOn(internals, 'cachedFilePromise').and.returnValue(mocks.filePromise);
        renderer.call(mocks.windshieldCallContextWithPaths, mocks.reply)(mocks.page).then(function (){
            expect(internals.cachedFilePromise).toHaveBeenCalledWith('/mock/alt-path/foo/templates/default.html', 'utf-8');
            done();
        });
    });

    xit("should use component name as path map when it does not exists in paths map", function (done) {
        spyOn(internals, 'cachedFilePromise').and.returnValue(mocks.filePromise);
        renderer.call(mocks.windshieldCallContext, mocks.reply)(mocks.page).then(function (){
            expect(internals.cachedFilePromise).toHaveBeenCalledWith('/mock/components/foo/templates/default.html', 'utf-8');
            done();
        });
    });

    xit("should set component name to 'notFound' if not already set and look for a corresponding template", function (done) {
        spyOn(internals, 'cachedFilePromise').and.returnValue(mocks.filePromise);
        renderer.call(mocks.windshieldCallContext, mocks.reply)(mocks.badPage).then(function (){
            expect(internals.cachedFilePromise).toHaveBeenCalledWith('/mock/components/notFound/templates/default.html', 'utf-8');
            done();
        });
    });

    xit("should use layout path from paths map when it exists", function (done) {
        spyOn(mocks.reply, 'view');
        renderer.call(mocks.windshieldCallContextWithPaths, mocks.reply)(mocks.page).then(function (){
            expect(mocks.reply.view).toHaveBeenCalledWith('alt-path/mockLayout', jasmine.any(Object));
            done();
        });
    });


});