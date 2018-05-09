import { ContentService, PlayerService, UserService, LearnerService, CoreModule } from '@sunbird/core';
import { SharedModule , ResourceService, ToasterService} from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlagContentComponent } from './flag-content.component';
import { ActivatedRoute, Router, Params, UrlSegment, NavigationEnd} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from './flag-content.component.spec.data';
describe('FlagContentComponent', () => {
  let component: FlagContentComponent;
  let fixture: ComponentFixture<FlagContentComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

const fakeActivatedRoute = { parent: { params: Observable.of({contentId: 'testId', contentName: 'hello'}) },
snapshot: {
  parent: {
    url: [
      {
        path: 'play',
      },
      {
        path: 'content',
      },
      {
        path: 'do_112498456959754240121',
      },
    ],
  }
}};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, CoreModule],
      providers: [{ provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagContentComponent);
    component = fixture.componentInstance;
  });
  it('should call get content', () => {
    const playerService = TestBed.get(PlayerService);
    component.contentData = Response.contentData;
    component.getContentData();
    expect(component.contentData).toBeDefined();
    expect(component.contentData.name).toEqual('TextBook3-CollectionParentLive');
  });
  it('should call getContent api when data is not present ', () => {
    const playerService = TestBed.get(PlayerService);
    playerService.contentData = {};
    spyOn(playerService, 'getContent').and.callFake(() => Observable.of(Response.successContentData));
    component.getContentData();
    component.contentData.name = Response.contentData.name;
    component.contentData.versionKey = Response.contentData.versionKey;
    expect(component.contentData).toBeDefined();
    expect(component.contentData.name).toEqual('TextBook3-CollectionParentLive');
    expect(component.contentData.versionKey).toEqual('1496989757647');
  });
  it('should subscribe to user service', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(Response.userSuccess));
    userService.getUserProfile();
    component.ngOnInit();
    component.userData.lastName = Response.userSuccess.result.response.lastName;
    component.userData.firstName = Response.userSuccess.result.response.firstName;
    expect(component.userData).toBeDefined();
    expect(component.userData.lastName).toEqual('User');
    expect(component.userData.firstName).toEqual('Cretation');
  });
  it('should call flag api', () => {
    const playerService = TestBed.get(PlayerService);
    const contentService = TestBed.get(ContentService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = Response.resourceBundle.messages;
    const modal = '';
    const requestData = {
      flaggedBy: 'Cretation User',
      versionKey: '1496989757647',
     flagReasons: 'others'
    };
    spyOn(contentService, 'post').and.callFake(() => Observable.of(Response.successFlag));
   component.populateFlagContent(requestData);
   expect(component.showLoader).toBeFalsy();
  });
  it('should  throw error when call flag api', () => {
    const playerService = TestBed.get(PlayerService);
    const contentService = TestBed.get(ContentService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = Response.resourceBundle.messages;
    const requestData = {
      flaggedBy: 'Cretation User',
      versionKey: '1496989757647'
    };
    spyOn(contentService, 'post').and.callFake(() => Observable.throw({}));
    spyOn(toasterService, 'error').and.callThrough();
   component.populateFlagContent(requestData);
   fixture.detectChanges();
   expect(component.showLoader).toBeFalsy();
   expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.fmsg.m0050);
  });
});