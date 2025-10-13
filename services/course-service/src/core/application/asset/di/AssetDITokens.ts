export class AssetDITokens {
  // Use cases
  static readonly CreateAssetUseCase: unique symbol =
    Symbol('CreateAssetUseCase');
  static readonly CompleteAssetUploadUseCase: unique symbol = Symbol(
    'CompleteAssetUploadUseCase',
  );
  static readonly AddAssetToLectureUseCase: unique symbol = Symbol(
    'AddAssetToLectureUseCase',
  );
  static readonly GetAssetUseCase: unique symbol = Symbol('GetAssetUseCase');

  // External Services
  static readonly FileStorageGateway: unique symbol =
    Symbol('FileStorageGateway');

  // Repository
  static readonly AssetRepository: unique symbol = Symbol('AssetRepository');

  // Controller
  static readonly AssetController: unique symbol = Symbol('AssetController');
}
