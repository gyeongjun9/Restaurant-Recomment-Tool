# 회식 장소 찾기

근무지에서 자동차 30분 이내인 KTX·SRT·지하철역과 그 역에서 도보 10분 이내인 식당을 찾습니다. 기존 Node 실행 구조를 사용하며 화면과 API를 같은 서버에서 제공합니다. 외부 npm 의존성은 없습니다.

## 실행

Node.js 22 이상이 필요합니다. PowerShell에서 이 폴더를 열고 실행합니다.

```powershell
node server.js
```

[http://127.0.0.1:3000](http://127.0.0.1:3000/)을 엽니다. 키 없이 실행하면 **데모 데이터**를 기본 선택합니다. 예시인 서울시청, 삼겹살·회, 12명으로 검색하면 추천 5곳과 확인 필요 2곳이 나옵니다. 공용타워는 동명 근무지 선택을, 부산은 동명의 다른 시청역과 식당 결과 없음 상태를 확인하는 데 쓸 수 있습니다. HTML 파일을 직접 열면 서버 API를 사용할 수 없습니다.

```powershell
npm.cmd test
```

## 외부 배포

이 저장소에는 컨테이너용 `Dockerfile`과 Render용 `render.yaml`이 있습니다. Node 서버가 웹 화면과 API를 같은 주소에서 제공합니다.

### Render에서 배포

1. 프로젝트 소스를 Git 저장소에 올립니다. 실제 `.env`와 비밀값은 호스팅 환경변수로 관리합니다.
2. Render Dashboard의 **New → Blueprint**에서 저장소를 연결하고 `render.yaml`을 적용합니다. 설정은 무료 Web Service를 생성하며, 서비스는 플랫폼이 제공하는 `PORT`를 사용합니다.
3. 배포 화면에 표시되는 HTTPS 주소를 열어 데모 검색을 확인합니다. `/health`가 200을 반환하면 서버가 준비된 상태입니다.
4. **Environment**에서 아래 표의 지도와 실데이터 키를 설정합니다. 네이버 클라우드 콘솔에는 실제 HTTPS 주소를 허용 URL로 등록합니다. 지도만 먼저 표시하려면 공개 키부터 설정할 수 있습니다.
5. 같은 서비스에 연결된 브랜치에 변경을 올리면 자동으로 재배포됩니다. 서비스 주소는 유지됩니다. 환경변수는 Render에서 별도로 관리합니다.

[Render Blueprint](https://render.com/docs/blueprint-spec) · [Render Web Services](https://render.com/docs/web-services)

### 다른 호스팅에서 배포

Node.js 22 이상을 지원하는 호스팅은 시작 명령 `npm start`, 환경변수 `HOST=0.0.0.0`과 호스팅이 제공하는 `PORT`, 상태 확인 경로 `/health`를 사용합니다. Docker 호스팅은 저장소 루트의 이미지 설정을 사용할 수 있습니다. 로컬 컨테이너 데모는 아래 명령으로 확인할 수 있습니다.

```powershell
docker build -t dinner-station .
docker run --rm -p 127.0.0.1:3000:3000 dinner-station
```

컨테이너에서 사용자 지정 역이나 매장 근거 JSON을 사용하려면 런타임에 파일을 마운트하고 `STATIONS_FILE` 또는 `EVIDENCE_FILE`에 컨테이너 내부 절대 경로를 지정합니다. 팀원만 이용하는 경우 호스팅 또는 프록시에서 접근 제어를 연결할 수 있습니다. 현재 앱 자체에는 로그인 기능이 없으므로 공개 주소에 실데이터 키를 연결하면 방문자가 검색 API 할당량을 사용할 수 있습니다.

## 공급자와 허용 URL

```powershell
Copy-Item .env.example .env
```

| 환경변수 | 발급 및 용도 |
| --- | --- |
| `NAVER_MAP_PUBLIC_KEY` | NAVER Cloud Platform 콘솔 → Services → Application Services → Maps → Application에서 Web Dynamic Map 활성화 후 Client ID. JS API v3의 `ncpKeyId`에 전달합니다. |
| `NCLOUD_MAPS_KEY_ID`, `NCLOUD_MAPS_KEY_SECRET` | 같은 Maps 메뉴에서 Geocoding과 Directions 5를 활성화한 애플리케이션의 ID와 Secret. |
| `NAVER_SEARCH_CLIENT_ID`, `NAVER_SEARCH_CLIENT_SECRET` | NAVER Cloud Platform 콘솔의 NAVER API HUB에서 검색 API 사용 권한을 활성화한 애플리케이션 인증값. 이전 네이버 개발자센터 Search 키는 이 서버의 API HUB 요청과 호환되지 않습니다. |
| `TMAP_APP_KEY` | TMAP API 개발자 포털에서 애플리케이션 생성 후 보행자 경로안내 활성화. 비어 있으면 후보를 도보 확인 필요로 표시합니다. |
| `STATIONS_FILE`, `EVIDENCE_FILE` | 선택 사항. 서버에서 읽을 역 목록과 매장 근거 JSON 파일 경로. 비울 경우 기본 역 목록을 사용하며 매장 근거는 비어 있습니다. |
| `HOST`, `PORT` | 기본값은 `127.0.0.1`, `3000`. 컨테이너에서 리버스 프록시를 사용하는 경우 `HOST=0.0.0.0`으로 지정할 수 있습니다. |

Maps 애플리케이션의 **Web 서비스 URL**에 브라우저에서 실제 여는 주소를 등록합니다. 로컬은 `http://127.0.0.1:3000` 또는 `http://localhost:3000`, 배포는 예를 들어 `https://dinner.example.com`입니다. 여러 주소를 사용하면 각각 등록합니다. 콘솔이 로컬 URL을 정규화하면 공식 안내 형식으로 등록한 뒤 실제 접속 URL에서 확인합니다. 환경 설정을 변경한 뒤 서버를 다시 시작합니다.

배포 시 화면과 API를 동일 HTTPS 호스트로 연결하고 프록시가 원래 Host를 유지하도록 구성합니다. 사내 검색 도구의 접근 제한과 전체 사용량 제한은 배포 프록시에서 설정합니다. 브라우저 설정 API는 지도 Client ID와 실데이터 모드 준비 상태를 제공합니다. 서버는 비밀값이나 공급자 응답 본문을 오류 및 로그에 출력하지 않습니다.

- [Maps JS v3의 Client ID](https://navermaps.github.io/maps.js.en/docs/tutorial-1-Getting-Client-ID.html)
- [Ncloud Maps REST 개요](https://api.ncloud-docs.com/docs/en/application-maps-overview) · [Directions 5](https://api.ncloud-docs.com/docs/application-maps-directions5)
- [NAVER API HUB 지역 검색](https://api.ncloud-docs.com/docs/en/naver-api-hub-search-local) · [지역 검색 좌표 변경 공지](https://developers.naver.com/notice/article/12567)
- [TMAP 보행자 경로안내](https://tmap-skopenapi.readme.io/reference/%EB%B3%B4%ED%96%89%EC%9E%90-%EA%B2%BD%EB%A1%9C%EC%95%88%EB%82%B4) · [TMAP API 약관](https://tmapapi.tmapmobility.com/terms.html)

## 역 데이터 갱신

기본 `stations.json`은 서울·경기·충남·부산에 있는 시범 역 11곳을 담은 목록입니다. 역 중심점은 검색 범위 산정과 마커에 사용합니다. 차량 접근은 공지된 주차장 주소를 지오코딩하거나 입력된 좌표를 직접 사용합니다. 주소를 변환한 경우 주차장 주소 지점이 기준이므로 실제 차량 진입로 좌표가 있으면 우선 입력합니다. 확인된 출입구 번호만 등록했고 일부 역의 출입구 좌표는 네이버 지역 검색에서 정확히 일치하는 단일 지점을 찾은 경우에 사용합니다. 검색에서 확인되지 않은 접근점은 확인 필요로 남습니다.

1. 운행기관의 최신 정차역과 공공데이터를 대조합니다. 환승이 연결되는 동일 역에는 서비스와 유형을 합쳐 한 행을 만들고, 다른 지역의 동명 역에는 각각 고유 ID를 유지합니다.
2. `id`, `name`, `region`, `types`(`KTX`·`SRT`·`metro`), `services`, 역 중심 `x`·`y`, `source`와 `asOf`를 갱신합니다.
3. `carAccess`에 차량 진입 WGS84 좌표 `x`(경도)·`y`(위도), `name`, `source`를 등록합니다. 공식 주차장 주소를 사용할 때는 좌표 대신 `address`를 넣습니다. `exits`에는 출입구별 `name`, `x`, `y`, `source`를 입력합니다. 출입구 전부가 검증된 경우에만 `exitsComplete`를 `true`로 설정합니다. 확인하지 못한 접근점은 `null` 또는 빈 배열을 사용합니다.
4. JSON 배열로 저장하고 서버를 재시작합니다. 각 역 유형에서 차량 도착 지점과 주요 출입구를 실제 길찾기로 확인합니다.

출처 자료는 [국가철도공단 철도역 정보](https://www.data.go.kr/data/15067652/fileData.do), [코레일 KTX 운행표](https://www.korail.com/file/cubedata/COMMON/jfile/202505/02/202505021968ea63ca0680.pdf), [SR 운행구간](https://www.srail.or.kr/cms/archive.do?pageId=KR0405000000), [전국 도시광역철도 역사 표준데이터](https://www.data.go.kr/data/15013205/standard.do), [서울시 지하철역 연계 지하도](https://data.seoul.go.kr/dataList/OA-21213/S/1/datasetView.do), [국가철도공단 역사별 출구 정보](https://www.data.go.kr/data/15041677/openapi.do)를 참고합니다.

## 매장 근거

지역 검색 API는 매장 후보 발견에 사용합니다. 공식 메뉴판, 매장 안내 또는 매장 확인 기록을 확보하면 운영자가 `EVIDENCE_FILE`에 넣어 추천 판정에 반영할 수 있습니다. 개별 매장에 대한 근거 파일은 초기 배포에 포함하지 않았습니다. 따라서 초기 실데이터에서는 메뉴와 단체석을 확인 필요로 표시합니다.

근거 파일은 매장 ID가 있을 경우 `id:123456789`, 그 외에는 `정규화상호|정규화주소`를 키로 하는 JSON 객체입니다. 정규화는 NFKC, 소문자화, 공백과 문장부호 제거 순서입니다. 값은 `sources`(근거 URL 배열), `menu`(메뉴명 배열), `menuComplete`(완전한 메뉴판 확인 시에만 true), `capacity`(동석 가능한 최대 인원), `hours`(요일별 영업 구간), `price`(1인 원), `room`·`parking`(불리언), `phone`을 사용할 수 있습니다. 예를 들어 KST 일요일 영업 구간은 `"hours":{"0":[["11:00","22:00"]]}`입니다. 휴무가 확인된 요일은 빈 배열로 입력합니다. 영업 판정은 시각표 기준이며 당일 휴무나 예약 상황은 매장에서 확인합니다. 날짜를 생략하면 일시 미입력으로 표시합니다.

## 검색 한계

- 직선 40km 내 각 선택 유형의 가까운 역 3곳, 합계 최대 9곳을 조회합니다. 여럿의 서비스가 연결된 역은 한 번 조회합니다. 거리는 대상 축소에 사용합니다. 차량과 도보 기준은 각각 원래 정밀도의 1,800초와 600초입니다.
- 식당 지역 검색은 지역명, 역명, 메뉴의 조합당 최대 5건이며 첫 페이지만 제공됩니다. 메뉴는 최대 4개, 식당 검색은 최대 36회입니다. 건물명 조회와 좌표가 없는 출입구 조회는 별도로 호출합니다.
- 식당별 가까운 출입구 최대 4곳, 검색당 중복 제거한 보행 최대 48건을 조회합니다. 성공한 경로 중 최단을 사용합니다. 확인된 유효 경로가 없고 출입구 조회가 불완전하면 도보 확인 필요로 남습니다.
- 요청별 타임아웃은 4.5초이고 처리 단계별 최대 6개를 병렬 조회합니다. 서버는 동시 작업 2개까지 처리하고 같은 공급자에 진행 중인 동일 요청을 합칩니다. 공급자 응답을 디스크에 저장하지 않습니다. TMAP 경로 표시 권한을 확인할 수 없어 보행 시간과 공급자만 표시합니다.
- 차량 시간은 Directions 5의 조회 시점 교통을 기준으로 합니다. 회식 일시는 매장 영업 판정에 사용합니다. 후보가 부족할 때 시간 기준을 완화하지 않습니다.

## 검수 결과

- Node 자동 검수 8개 통과. KTX·SRT·지하철 개별 선택, 복수 서비스·동명 역, 동명 근무지, 여러 출입구, 1,800초·600초 경계, 1초·1ms 초과 처리, 식당 중복과 다른 지점, 인원·메뉴·시간·예산 판정, 후보 없음, TMAP 미설정, 일부 시간 초과를 검증했습니다.
- 가짜 공급자 응답으로 API 경로, 인증 헤더, 위경도 순서, 밀리초 변환을 확인했습니다. 로컬 HTTP 테스트에서 공개 키 응답, 환경 파일 접근 거부와 비밀값 비노출을 검증했습니다. 지도 인증 오류는 가짜 SDK 콜백으로 검증했습니다.
- Windows Edge에서 키 미설정 안내와 데모 예시 검색을 확인했습니다. 추천 5곳, 확인 필요 2곳, 경계값 카드, 12명 단체석 전화 확인, 일시 미입력 표시가 나타났습니다.
- 실제 키가 없어 등록 URL의 지도 인증과 타일, 지도 줌·이동 및 마커와 카드의 양방향 선택, 모바일 지도 터치, 실데이터 공급자 응답, 공식 주차장 주소의 경로 진입 위치, 실제 출입구 검색 결과는 미검증입니다. 위 콘솔 설정 후 동일 UI에서 세 유형을 개별로 검색하고, 지도와 목록의 동기화 및 경로 출발·도착 지점을 확인해야 합니다.